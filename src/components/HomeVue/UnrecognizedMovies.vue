<template>
  <div class="unrecognized-movies" @click="navigateToMovieMatching">
    <h3>Unrecognized Movies</h3>
    <div class="movies-container" v-if="movies.length > 0">
      <p>{{ movies.length }} unrecognized movies found.</p>
    </div>
    <div v-else class="no-movies">No unrecognized movies found</div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useNavigationStore } from '@/stores/useNavigationStore';

  const navigationStore = useNavigationStore();
  const movies = ref([]);

  const fetchUnrecognizedMovies = async () => {
    try {
      const response = await axios.get('http://localhost:8112/api/MediaDisplay/unrecognized-movies');

      // Ensure the response data is an array
      if (Array.isArray(response.data)) {
        movies.value = response.data;
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching unrecognized movies:', error);
    }
  };

  // Navigate to the movie matching page
  const navigateToMovieMatching = () => {
    navigationStore.navigateToUnrecognizedMovies();
  };

  onMounted(fetchUnrecognizedMovies);
</script>

<style scoped>
  .unrecognized-movies {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    background: rgb(24, 24, 24);
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

    .unrecognized-movies:hover {
      background-color: #3a3a3a;
    }

    .unrecognized-movies h3 {
      margin-top: 0;
      margin-bottom: 20px;
      color: var(--color-text);
    }

  .movies-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .no-movies {
    text-align: center;
    padding: 20px;
    color: #666;
  }
</style>
