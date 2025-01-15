<!-- MovieGrid.vue -->
<template>
  <div class="container">
    <div v-if="loading" class="loading">Loading movies...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="movie-grid">
      <MovieContainer
  v-for="movie in movies"
  :key="movie.movieID"
  :to="`/movies/${movie.movieID}`"
  :image="`/api/movies/${movie.movieID}/poster`"
  :title="movie.title"
/>

    </div>
  </div>
</template>

<script setup lang="ts">
import MovieContainer from './MovieContainer.vue';
import { inject, ref, computed } from 'vue'
import type { Movie, MovieStore } from '@/types'

const movieStore = inject('movieStore') as MovieStore
const loading = ref(true)
const error = ref<string | null>(null)

const movies = computed(() => movieStore.movies.value)
const lastFetched = computed(() => movieStore.lastFetched.value)

const loadMovies = async () => {
  try {
    loading.value = true
    await movieStore.fetchMovies()
  } catch (e) {
    error.value = `Failed to load movies: ${(e as Error).message}`
    console.error('Error fetching movies:', e)
  } finally {
    loading.value = false
  }
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://placehold.co/300x450?text=No+Poster'
}

// Load movies when component is mounted
loadMovies()
</script>

<style scoped>
.container {
    background-color: var(--color-background-soft);
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
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    width: 100%;
}

.movie-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: scale(1.05);
}

.poster-container {
    position: relative;
    width: 100%;
    padding-top: 150%; /* This maintains 2:3 aspect ratio */
}

.poster-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain; /* Changed from cover to contain */
    border-radius: 0.5rem;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.movie-card:hover .overlay {
  background: rgba(0, 0, 0, 0.6);
}

.movie-title {
  color: white;
  text-align: center;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.movie-card:hover .movie-title {
  opacity: 1;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: var(--color-text);
}

.error {
  color: #dc2626;
}
</style>