<template>
  <v-container class="page-background d-flex" fluid>
    <v-card class="match-movies" width="90vw" max-width="1400px">
      <v-card-title class="text-h4 text-center py-4">Unrecognized TV Files</v-card-title>
      <v-divider class="mx-4 mb-4"></v-divider>
      <v-card-text>
        <v-table class="movie-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Extracted Title</th>
              <th>Extracted Year</th>
              <th>Recommended Match</th>
              <th>TMDB ID</th>
              <th>Season</th>
              <th>Episode</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tv in tvs" :key="tv.videoID">
              <td>{{ tv.fileName }}</td>
              <td>{{ tv.extractedTitle }}</td>
              <td>{{ tv.extractedYear || 'N/A' }}</td>
              <td>
                <span v-if="tv.recommendedMatch">
                  {{ tv.recommendedMatch.title }} (S{{ tv.recommendedMatch.season }}E{{ tv.recommendedMatch.episode }})
                </span>
                <span v-else>No match</span>
              </td>
              <td>
                <v-text-field v-model="tv.manualTmdbId" placeholder="TMDB ID" density="compact" hide-details variant="outlined" />
              </td>
              <td>
                <v-text-field v-model="tv.manualSeasonNumber" placeholder="Season" type="number" density="compact" hide-details variant="outlined" />
              </td>
              <td>
                <v-text-field v-model="tv.manualEpisodeNumber" placeholder="Episode" type="number" density="compact" hide-details variant="outlined" />
              </td>
              <td>
                <v-btn color="primary" size="large" @click="confirmMatch(tv)" :disabled="tv.linked">
                  {{ tv.linked ? 'Matched' : 'Confirm' }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="showSuccess" color="success" timeout="3000" location="top">
      <v-icon start>mdi-check-circle</v-icon>
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccess = false">Close</v-btn>
      </template>
    </v-snackbar>

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
  import { getService } from '@/services';

  const tvs = ref([]);
  const showSuccess = ref(false);
  const showError = ref(false);
  const successMessage = ref('');
  const errorMessage = ref('');

  const fetchUnrecognizedTv = async () => {
    try {
      const response = await getService.getUnrecognizedTv();
      if (Array.isArray(response.data)) {
        tvs.value = response.data.map(tv => {
          const extractedYear = extractYear(tv.fileName);
          return {
            ...tv,
            extractedTitle: extractTitle(tv.fileName, extractedYear),
            extractedYear,
            recommendedMatch: null,
            manualTmdbId: '',
            manualSeasonNumber: '',
            manualEpisodeNumber: '',
            linked: false
          };
        });
      }
    } catch (error) {
      showErrorNotification('Error fetching unrecognized TV shows');
      console.error(error);
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
    if (extractedYear) cleanTitle = cleanTitle.split(extractedYear)[0].trim();
    return cleanTitle.trim();
  };

  const confirmMatch = async (tv) => {
    const tmdbId = parseInt(tv.manualTmdbId || tv.recommendedMatch?.id || '', 10);
    const seasonNumber = parseInt(tv.manualSeasonNumber || tv.recommendedMatch?.season || '', 10);
    const episodeNumber = parseInt(tv.manualEpisodeNumber || tv.recommendedMatch?.episode || '', 10);

    if (!tmdbId || !seasonNumber || !episodeNumber) {
      showErrorNotification('Provide TMDB ID, season, and episode.');
      return;
    }

    const payload = {
      videoID: tv.videoID,
      tmdbTvID: tmdbId,
      seasonNumber,
      episodeNumber
    };

    try {
      await getService.linkTv(payload);
      tv.linked = true;
      showSuccessNotification(`Linked to TMDB S${seasonNumber}E${episodeNumber}. Refreshing...`);
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to link TV show';
      showErrorNotification(msg);
      console.error(error);
    }
  };

  const showSuccessNotification = (msg: string) => {
    successMessage.value = msg;
    showSuccess.value = true;
  };

  const showErrorNotification = (msg: string) => {
    errorMessage.value = msg;
    showError.value = true;
  };

  onMounted(fetchUnrecognizedTv);
</script>

<style scoped>
  /* same styles as before, unchanged */
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

  :deep(.v-field__outline) {
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
