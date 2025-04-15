<template>
  <div class="container">
    <div v-if="loading" class="loading">Loading movies...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="movie-grid">
      <MovieContainer
        v-for="media in combinedMedia"
        :key="`${media.mediaType}-${media.movieID ?? media.tvShowID}`"
        :to="`/${media.mediaType}/${media.movieID ?? media.tvShowID}`"
        :mediaId="media.mediaType === 'movie' ? media.movieID : media.tvShowID"
        :title="media.title ?? media.originalName"
        :mediaType="media.mediaType"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch ,inject} from 'vue';
  import type { PropType } from 'vue';
  import MovieContainer from './MovieContainer.vue';
  import type { MovieStore } from '@/types';
  import type { TvStore } from '@/types';
  import { MediaTypes } from '@/enums/MediaTypeEnum';

  const movieStore = inject<MovieStore | null>('movieStore', null);
  const tvStore = inject<TvStore | null>('tvStore', null);

  // Ensure movieStore is defined before accessing properties
  const filteredMovies = computed(() => {
    return [...(movieStore?.filterMovies?.value ?? [])]
      .map(movie => ({
        ...movie,
        mediaType: MediaTypes.Movie
      }))
      .sort((a, b) => a.order - b.order);
  });

  const filteredShows = computed(() => {
    return [...(tvStore?.filterTvShows?.value ?? [])]
      .map(show => ({
        ...show,
        mediaType: MediaTypes.Tv
      }))
      .sort((a, b) => a.order - b.order);
  });

  const combinedMedia = computed(() => {
    const includeMovies = !props.selectedMedia || props.selectedMedia.length === 0 || props.selectedMedia.includes('movie');
    const includeShows = !props.selectedMedia || props.selectedMedia.length === 0 || props.selectedMedia.includes('tv');

    let results: any[] = [];
    if(includeMovies) results = results.concat(filteredMovies.value);
    if(includeShows) results = results.concat(filteredShows.value);

    return results.sort((a, b) => a.order - b.order);
  });

  // Props passed from parent component
  const props = defineProps({
    selectedGenres: Array as PropType<string[]>,
    selectedMedia: Array as PropType<string[]>,
    yearRange: Array as PropType<number[]>,
    runtime: Number,
    search: String,
    filterOrder: Number
  });

  const loading = ref(true);
  const error = ref<string | null>(null);

  // Watch for changes in the individual props and refetch movies accordingly
  const loadMovies = async () => {
    if (!movieStore) {
      console.error("MovieStore is not provided.");
      return;
    }

    try {
      console.log(props.search,props.runtime,props.filterOrder,props.yearRange)
      loading.value = true;
      await movieStore.fetchFilterMovies(
        false,
        props.search ?? "",
        props.runtime ?? null,
        props.filterOrder ?? null,
        props.yearRange?.length ? Number(props.yearRange[0]) : 1900,
        props.yearRange?.length ? Number(props.yearRange[1]) : 2100
      );
    } catch (e) {
      error.value = `Failed to load movies: ${(e as Error).message}`;
    } finally {
      loading.value = false;
    }
  };

  const loadShows = async () => {
    if (!tvStore) {
      console.error("TvStore is not provided.");
      return;
    }

    try {
      console.log(props.search,props.filterOrder,props.yearRange)
      loading.value = true;
      await tvStore.fetchFilterShows(
        false,
        props.search ?? "",
        props.filterOrder ?? null,
        props.yearRange?.length ? Number(props.yearRange[0]) : 1900,
        props.yearRange?.length ? Number(props.yearRange[1]) : 2100
      );
    }
    catch (e) {
      error.value = `Failed to load Tv Shows: ${(e as Error).message}`;
    }
    finally {
      loading.value = false;
    }
  };

  // Watch individual props
  watch(() => [
  props.selectedGenres,
  props.selectedMedia,
  props.yearRange,
  props.runtime,
  props.search,
  props.filterOrder
], () => {
  loadMovies();
  loadShows();
 },
 { deep: true });

  onMounted(() => {
    loadMovies();
    loadShows();
  });
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

  .loading,
  .error {
    text-align: center;
    font-size: 1.5rem;
  }
</style>
