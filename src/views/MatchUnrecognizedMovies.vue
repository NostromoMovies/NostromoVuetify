<template>
  <div class="match-movies">
    <h3>Unrecognized Movies</h3>

    <table>
      <thead>
        <tr>
          <th>Filename</th>
          <th>Extracted Title</th>
          <th>Extracted Year</th>
          <th>Recommended Match</th>
          <th>Manual TMDB ID</th>
          <th>Action</th>
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
            <input v-model="movie.manualTmdbId" type="text" placeholder="Enter TMDB ID" />
          </td>
          <td>
            <button @click="confirmMatch(movie)">Confirm</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const movies = ref([]);

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
            manualTmdbId: ''
          };
        });
        await fetchRecommendedMatches();
      }
    } catch (error) {
      console.error('Error fetching unrecognized movies:', error);
    }
  };

  const extractYear = (fileName: string) => {
    const match = fileName.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : null;
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

  const confirmMatch = async (movie) => {
    let tmdbId = movie.manualTmdbId || (movie.recommendedMatch ? movie.recommendedMatch.id : null);
    if (!tmdbId) {
      alert('Please provide a TMDB ID.');
      return;
    }
    tmdbId = parseInt(tmdbId, 10);
    const payload = {
      VideoID: movie.videoID,
      TMDBMovieID: tmdbId
    };
    console.log("Sending payload:", JSON.stringify(payload));
    try {
      const response = await axios.post('http://localhost:8112/api/MediaDisplay/linkMovie', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      movie.linked = true;
      alert(`Movie "${movie.fileName}" successfully linked to TMDB ID ${tmdbId}!`);
    } catch (error) {
      console.error('Error linking movie:', error);
      alert(`Failed to link movie. ${error.response?.data?.message || ''}`);
    }
  };

  onMounted(fetchUnrecognizedMovies);
</script>

<style scoped>
  .match-movies {
    padding: 20px;
    background: #2e2e2e;
    color: white;
    border-radius: 8px;
    margin-top: 80px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }

  th, td {
    padding: 10px;
    border: 1px solid #444;
    text-align: left;
  }

  th {
    background: #3a3a3a;
  }

  input {
    padding: 5px;
    width: 120px;
    min-width: 100px;
    box-sizing: border-box;
  }

  button {
    padding: 6px;
    background: #3a3a3a;
    color: white;
    border: none;
    cursor: pointer;
  }

    button:hover {
      background: #41f00b;
    }
</style>
