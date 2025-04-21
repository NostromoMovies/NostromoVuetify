<template>
  <div class="container">
    <div v-if="loading" class="loading">Loading movies...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="movie-grid">
      <MovieContainer 
        v-for="movie in filteredMovies" 
        :key="movie.order" 
        :to="`/movies/${movie.movieID}`"
        :movieId="movie.movieID"
        :title="movie.title" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue';
import type { PropType } from 'vue';
import MovieContainer from './MovieContainer.vue';
import type { MovieStore } from '@/types';

// Props passed from parent component
const props = defineProps({
  selectedGenres: {
    type: Array as PropType<number[]>, 
    default: () => []
  },
  selectedMedia: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  yearRange: {
    type: Array as PropType<number[]>,
    default: () => [1900, 2100]
  },
  runtime: Number,
  search: String,
  filterOrder: Number
});

const loading = ref(true);
const error = ref<string | null>(null);

const movieStore = inject<MovieStore | null>('movieStore', null);

const filteredMovies = computed(() => {
  return [...(movieStore?.filterMovies?.value ?? [])].sort((a, b) => a.order - b.order);
});

const loadMovies = async () => {
  if (!movieStore) {
    console.error("MovieStore is not provided.");
    return;
  }

  try {
    loading.value = true;
    console.log("Filter params:", {
      search: props.search,
      runtime: props.runtime,
      filterOrder: props.filterOrder,
      yearRange: props.yearRange,
      genres: props.selectedGenres // No need for `toRaw` here
    });

    await movieStore.fetchFilterMovies(
  false,
  props.search ?? "",                        // query
  props.runtime ?? null,                     // runtime
  props.filterOrder ?? null,                 // searchTerm
  props.yearRange?.length ? Number(props.yearRange[0]) : 1900,
  props.yearRange?.length ? Number(props.yearRange[1]) : 2100,
  props.selectedGenres.map(String) ?? null   // genre as string[]
);
  } catch (e) {
    error.value = `Failed to load movies: ${(e as Error).message}`;
  } finally {
    loading.value = false;
  }
};

// Re-fetch when any filter prop changes
watch(() => [
  props.selectedGenres,
  props.selectedMedia,
  props.yearRange,
  props.runtime,
  props.search,
  props.filterOrder
], loadMovies, { deep: true });

onMounted(loadMovies);
</script>

<style scoped>
.container {
  background-color: rgb(34, 34, 34);
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

.loading,
.error {
  text-align: center;
  font-size: 1.5rem;
}
</style>
