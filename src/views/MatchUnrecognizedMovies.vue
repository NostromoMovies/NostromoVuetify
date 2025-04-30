<template>
  <v-container class="page-background d-flex " margin="100px" fluid>
    <v-card class="match-movies" width="90vw" max-width="1400px" margin="50px">
      <v-card-title class="text-h4 text-center py-4">Unrecognized Media Files</v-card-title>
      <v-divider class="mx-4 mb-4"></v-divider>
      <v-card-text>
        <v-table class="movie-table">
          <thead>
            <tr>
              <th class="text-left">Filename</th>
              <th class="text-left">Extracted Title</th>
              <th class="text-left">Extracted Year</th>
              <th class="text-left">Recommended Match</th>
              <th class="text-left">Manual TMDB ID</th>
              <th class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movie in movies" :key="movie.videoID">
              <td>{{ movie.fileName }}</td>
              <td>{{ movie.extractedTitle }}</td>
              <td>{{ movie.extractedYear || 'N/A' }}</td>
              <td>
                <span v-if="movie.recommendedMatch">
                  {{ movie.recommendedMatch.title }} ({{ movie.recommendedMatch.year }})
                </span>
                <span v-else>No match found</span>
              </td>
              <td>
                <v-text-field
                  v-model="movie.manualTmdbId"
                  placeholder="Enter TMDB ID"
                  density="compact"
                  hide-details
                  variant="outlined"
                />
              </td>
              <td>
                <v-btn
                  color="primary"
                  size="large"
                  @click="confirmMatch(movie)"
                  :disabled="movie.linked"
                >
                  {{ movie.linked ? 'Matched' : 'Confirm' }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000" location="top">
      <v-icon start>mdi-check-circle</v-icon>
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccess = false">Close</v-btn>
      </template>
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar v-model="showError" color="error" timeout="3000" location="top">
      <v-icon start>mdi-alert-circle</v-icon>
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const movies = ref([]);
const showSuccess = ref(false);
const showError = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const fetchUnrecognizedMovies = async () => {
  try {
    const response = await axios.get('http://localhost:8112/api/MediaDisplay/unrecognized-movies');
    if (Array.isArray(response.data)) {
      movies.value = response.data.map(movie => {
        const extractedYear = extractYear(movie.fileName);
        return {
          ...movie,
          extractedTitle: extractTitle(movie.fileName, extractedYear),
          extractedYear,
          recommendedMatch: null,
          manualTmdbId: '',
          linked: false
        };
      });
      await fetchRecommendedMatches();
    }
  } catch (error) {
    showErrorNotification('Error fetching unrecognized movies');
    console.error('Error fetching unrecognized movies:', error);
  }
};

const extractYear = (fileName: string) => {
  const matches = fileName.match(/\b(18[89]\d|19\d{2}|20\d{2})\b/g);
  return matches ? matches[matches.length - 1] : null;
};

const extractTitle = (fileName: string, extractedYear: string | null) => {
  let cleanTitle = fileName.replace(/\.(mkv|mp4|avi|mov|flv|wmv|webm)$/i, '');
  cleanTitle = cleanTitle.replace(/[\._-]/g, ' ');
  cleanTitle = cleanTitle.replace(/\[.*?\]|\(.*?\)/g, '');
  if (extractedYear) {
    cleanTitle = cleanTitle.split(extractedYear)[0].trim();
  }
  return cleanTitle.trim();
};

const fetchRecommendedMatches = async () => {
  for (const movie of movies.value) {
    if (!movie.extractedTitle) continue;
    try {
      const response = await axios.get('http://localhost:8112/api/Tmdb/search', {
        params: { query: movie.extractedTitle }
      });
      const tmdbResults = response.data?.data?.items || [];
      if (Array.isArray(tmdbResults) && tmdbResults.length > 0) {
        const normalizedTitle = movie.extractedTitle.toLowerCase().trim();
        const extractedYear = movie.extractedYear;
        let bestMatch = tmdbResults.find(tmdbMovie => {
          const tmdbTitle = tmdbMovie.title.toLowerCase().trim();
          const tmdbYear = tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : null;
          return tmdbTitle === normalizedTitle && extractedYear === tmdbYear;
        });
        if (!bestMatch) {
          bestMatch = tmdbResults.find(tmdbMovie => {
            const tmdbTitle = tmdbMovie.title.toLowerCase().trim();
            return tmdbTitle === normalizedTitle;
          });
        }
        if (!bestMatch && extractedYear) {
          bestMatch = tmdbResults
            .filter(tmdbMovie => {
              const tmdbYear = tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : null;
              return extractedYear === tmdbYear;
            })
            .sort((a, b) => b.popularity - a.popularity)[0];
        }
        if (bestMatch) {
          movie.recommendedMatch = {
            id: bestMatch.id,
            title: bestMatch.title,
            year: bestMatch.release_date ? bestMatch.release_date.split('-')[0] : 'N/A',
          };
        }
      }
    } catch (error) {
      console.error(`Error fetching TMDB data for ${movie.fileName}:`, error);
    }
  }
};

const showSuccessNotification = (message: string) => {
  successMessage.value = message;
  showSuccess.value = true;
};

const showErrorNotification = (message: string) => {
  errorMessage.value = message;
  showError.value = true;
};

const confirmMatch = async (movie) => {
  let tmdbId = movie.manualTmdbId || (movie.recommendedMatch ? movie.recommendedMatch.id : null);
  if (!tmdbId) {
    showErrorNotification('Please provide a TMDB ID');
    return;
  }
  tmdbId = parseInt(tmdbId, 10);
  const payload = {
    VideoID: movie.videoID,
    TMDBMovieID: tmdbId
  };
  
  try {
    const response = await axios.post('http://localhost:8112/api/MediaDisplay/linkMovie', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    movie.linked = true;
    showSuccessNotification(`Successfully linked to TMDB ID ${tmdbId}! Refreshing...`);
    
    // Full page refresh 
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Failed to link movie';
    showErrorNotification(errorMsg);
    console.error('Error linking movie:', error);
  }
};

onMounted(fetchUnrecognizedMovies);
</script>

<style scoped>
.page-background {
  background: #121212;  
  min-height: 100vh;
  padding: 40px 0;
  width: 100vw;
  margin: 0;
}

.match-movies {
  background: #1e1e1e;  
  color: #e0e0e0;      
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  margin: 0 auto;
  margin-top: 54px;
  border: 1px solid #333; 
}

:deep(.v-table) {
  background: #1e1e1e;
  color: #e0e0e0;
  font-size: 1.1rem;
}

:deep(.v-table thead th) {
  background: #2a2a2a; 
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 16px;
  border-bottom: 1px solid #333;
}

:deep(.v-table tbody td) {
  padding: 12px 16px;
  font-size: 1.05rem;
  border-bottom: 1px solid #333;
}

:deep(.v-table tbody tr:hover) {
  background: #2a2a2a; 
}

:deep(.v-text-field) {
  background-color: #252525; 
}

:deep(.v-text-field input) {
  color: #ffffff;
  font-size: 1.05rem;
}

:deep(.v-text-field .v-field__outline) {
  color: #444 !important;  
}

:deep(.v-btn) {
  font-size: 1rem;
  letter-spacing: 0.5px;
  background-color: #333; 
  color: #ffffff;
}

:deep(.v-btn:hover) {
  background-color: #444 !important;  
}

:deep(.v-divider) {
  border-color: #333 !important;  
}
</style>