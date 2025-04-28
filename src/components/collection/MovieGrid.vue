<template>
  <div class="container">
    <div v-if="loading" class="loading">Loading movies...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="movie-grid">
        <MovieContainer v-for="media in paginatedMedia"
                        :key="`${media.mediaType}-${getMediaId(media)}`"
                        :to="`/${media.mediaType}/${getMediaId(media)}`"
                        :mediaId="getMediaId(media)"
                        :title="media.title"
                        :posterPath="media.posterPath ?? null"
                        :mediaType="media.mediaType"
                        :isInCollection="media.isInCollection || false"
                        :collectionId="media.collectionId" />
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <button @click="prevPage"
                :disabled="currentPage === 1"
                class="page-button">
          Previous
        </button>

        <button v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="{ active: currentPage === page }"
                class="page-button">
          {{ page }}
        </button>

        <button @click="nextPage"
                :disabled="currentPage === totalPages"
                class="page-button">
          Next
        </button>
      </div>

      <!-- Infinite scroll observer -->
      <div v-if="infiniteScrollEnabled" ref="observerElement" class="observer-element"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch, inject } from 'vue';
  import type { PropType } from 'vue';
  import { useIntersectionObserver } from '@vueuse/core';
  import MovieContainer from './MovieContainer.vue';
  import type { MovieStore } from '@/types';
  import type { TvStore } from '@/types';
  import type { CollectionStore } from '@/types';
  import { MediaTypes } from '@/enums/MediaTypeEnum';

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
  const currentPage = ref(1);
  const itemsPerPage = 32;
  const observerElement = ref<HTMLElement | null>(null);
  const infiniteScrollEnabled = ref(false);

  const movieStore = inject<MovieStore | null>('movieStore', null);
  const tvStore = inject<TvStore | null>('tvStore', null);
  const collectionStore = inject<CollectionStore | null>('collectionStore', null);

  const getMediaId = (m: any) =>
    m.mediaId
    ?? m.TmdbTvID
    ?? m.TmdbMovieID
    ?? m.tvShowID
    ?? m.movieID
    ?? m.id
    ?? null;

  useIntersectionObserver(
    observerElement,
    ([{ isIntersecting }]) => {
      if (isIntersecting && infiniteScrollEnabled.value && currentPage.value < totalPages.value) {
        currentPage.value += 1;
      }
    },
    { threshold: 0.1 }
  );

  const filteredMovies = computed(() => {
    return [...(movieStore?.filterMovies?.value ?? [])]
      .map(movie => ({
        ...movie,
        mediaType: MediaTypes.Movie,
        isInCollection: movie.isInCollection ?? false
      }))
      .sort((a, b) => a.order - b.order);
  });

  const filteredShows = computed(() => {
    return [...(tvStore?.filterTvShows?.value ?? [])]
      .map(show => ({
        ...show,
        mediaType: MediaTypes.Tv,

        id: show.tvShowID ?? show.id,
        collectionId: show.collectionId ?? show.collectionID ?? null,
        isInCollection: show.isInCollection ?? false
      }))
      .sort((a, b) => a.order - b.order);
  });

  const filteredCollections = computed(() => {
    return [...(collectionStore?.collections?.value ?? [])]
      .filter(collection => collection.items && collection.items.length > 0)
      .map(collection => ({
        id: collection.collectionID,
        title: collection.name,
        posterPath: collection.posterPath,
        order: collection.order,
        mediaType: MediaTypes.Collection,
      }))
      .sort((a, b) => a.order - b.order);
  });

  const combinedMedia = computed(() => {
    const includeMovies = !props.selectedMedia || props.selectedMedia.includes('movie');
    const includeShows = !props.selectedMedia || props.selectedMedia.includes('tv');
    const includeCollections = true;

    let results: any[] = [];

    if (includeMovies) {
      results = results.concat(filteredMovies.value);
    }

    if (includeShows) {
      results = results.concat(filteredShows.value);
    }

    if (includeCollections) {
      results = results.filter(m =>
        m.mediaType === 'collection' ? true : !m.isInCollection
      );
      results = results.concat(filteredCollections.value);
    }

    return results.sort((a, b) => a.order - b.order);
  });

  const paginatedMedia = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return combinedMedia.value.slice(0, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(combinedMedia.value.length / itemsPerPage);
  });

  const visiblePages = computed(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages.value, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  });

  const loadMovies = async () => {
    if (!movieStore) {
      console.error("MovieStore is not provided.");
      return;
    }

    try {
      loading.value = true;
      currentPage.value = 1;
      
      await movieStore.fetchFilterMovies(
        false,
        props.search ?? "",
        props.runtime ?? null,
        props.filterOrder ?? null,
        props.yearRange?.length ? Number(props.yearRange[0]) : 1900,
        props.yearRange?.length ? Number(props.yearRange[1]) : 2100,
        props.selectedGenres.map(String) ?? null
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
      loading.value = true;
      currentPage.value = 1;
      
      await tvStore.fetchFilterShows(
        false,
        props.search ?? "",
        props.filterOrder ?? null,
        props.yearRange?.length ? Number(props.yearRange[0]) : 1900,
        props.yearRange?.length ? Number(props.yearRange[1]) : 2100
      );
    } catch (e) {
      error.value = `Failed to load Tv Shows: ${(e as Error).message}`;
    } finally {
      loading.value = false;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value += 1;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const toggleInfiniteScroll = () => {
    infiniteScrollEnabled.value = !infiniteScrollEnabled.value;
    if (!infiniteScrollEnabled.value) {
      currentPage.value = 1;
    }
  };

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
  }, { deep: true });

  onMounted(async () => {
    loading.value = true;

    const promises = [loadMovies(), loadShows()];

    if (collectionStore) {
      promises.push(collectionStore.fetchCollections());
    }

    await Promise.all(promises);

    console.log('Collections:', collectionStore?.collections.value);

    loading.value = false;
  });
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
  overflow-y: auto;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 200px));
  gap: 2rem;
  margin-bottom: 2rem;
}

.loading,
.error {
  text-align: center;
  font-size: 1.5rem;
  margin: 2rem 0;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.page-button {
  padding: 0.5rem 1rem;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page-button:hover:not(:disabled) {
  background-color: #555;
}

.page-button.active {
  background-color: #007bff;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.observer-element {
  height: 20px;
  width: 100%;
}

.infinite-scroll-toggle {
  display: block;
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
