<template>
  <div class="container">
    <div v-if="loading" class="loading">Loading movies...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="movie-grid">
      <MovieContainer v-for="movie in movies"
                      :key="movie.movieID"
                      :to="`/movies/${movie.movieID}`"
                      :movieId="movie.movieID"
                      :title="movie.title" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import MovieContainer from './MovieContainer.vue';
  import { inject, ref, computed, onMounted } from 'vue';
  import type { MovieStore } from '@/types';

  const movieStore = inject('movieStore') as MovieStore;
  const loading = ref(true);
  const error = ref<string | null>(null);

  const movies = computed(() => movieStore.movies.value);

  const loadMovies = async () => {
    try {
      loading.value = true;
      await movieStore.fetchMovies();
    } catch (e) {
      error.value = `Failed to load movies: ${(e as Error).message}`;
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadMovies);
</script>

<style scoped>
  .container {
    background-color: rgb(34,34,34);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    flex: 1;
    width: 100%;
    border-radius: 5px;
    margin-top: 50px;
    padding: 1rem;
    overflow: auto;
  }

  .movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 200px));
    gap: 2rem;
  }
</style>
