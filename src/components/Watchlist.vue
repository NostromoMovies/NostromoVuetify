<template>
  <v-container class="container">
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="loading"
    ></v-progress-circular>

    <v-alert
      v-else-if="error"
      type="error"
      class="error"
    >
      {{ error }}
    </v-alert>

    <div v-else>
      <!-- Watchlist Name Header -->
      <v-row class="mb-6" align="center">
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold">
            {{ watchlistName }}
            <v-chip class="ml-2" color="primary">
              {{ movies.length }} {{ movies.length === 1 ? 'item' : 'items' }}
            </v-chip>
          </h1>
          <v-divider class="my-4"></v-divider>
        </v-col>
      </v-row>

      <!-- Movies Grid -->
      <v-row class="movie-grid">
        <v-col
          v-for="movie in paginatedMovies"
          :key="movie.id"
          cols="6"
          sm="4"
          md="3"
          lg="2"
          xl="2"
        >
        <WatchlistContainer
  :to="`/movie/${movie.id}`"
  :media-id="movie.id"
  :title="movie.title"
  :poster-path="movie.poster_path"
  media-type="movie"
  @remove="removeFromWatchlist(movie)"
/>
        </v-col>
      </v-row>

      <!-- Pagination -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        class="pagination-controls mt-6"
        circle
      ></v-pagination>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
;
import WatchlistContainer from './collection/WatchlistContainer.vue';
import type { Movie, MovieStore } from "../types";
import type { Tv, TvStore } from "../types"

interface ApiMovie {
  movieID?: string | number;
  tmdbid?: string | number;
  title: string;
  posterPath?: string | null;
  overview?: string | null;
  releaseDate?: string | null;
  runtime?: string | null;
  backdropPath?: string | null;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  // Add other movie properties as needed
}

interface ApiTvShow {
  tvShowID: number;
  originalName: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  overview?: string | null;
  firstAirDate?: string | null;
  isInCollection?: boolean;
  collectionId: number | null;
}

interface Tv {
  id: number;
  title: string;
  posterPath: string
}

const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);
const watchlistName = ref('My Watchlist');
const movies = ref<Movie[]>([]);
const tvShows = ref<Tv[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(20);
const watchlistMovies = ref<Movie[]>([]);
const watchlistTvShows = ref<Tv[]>([]);


const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return movies.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(movies.value.length / itemsPerPage.value);
});

const fetchWatchlistMovies = async () => {
  try {
    loading.value = true;
    const watchlistId = route.params.id;

    // Fetch watchlist details
    const watchlistResponse = await fetch(`/api/WatchList/${watchlistId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("apikey")}`
      }
    });

    if (!watchlistResponse.ok) {
      throw new Error('Failed to fetch watchlist details');
    }

    const watchlistData = await watchlistResponse.json();
    watchlistName.value = watchlistData.name;

    // Fetch movies in the watchlist
    const moviesResponse = await fetch(`/api/WatchList/${watchlistId}/movies`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("apikey")}`
      }
    });

    if (!moviesResponse.ok) {
      throw new Error(`HTTP error! Status: ${moviesResponse.status}`);
    }

    const jsonResponse = await moviesResponse.json();
    console.log("Raw API Response:", jsonResponse);

    if (!Array.isArray(jsonResponse)) {
      throw new Error("Invalid API response format: Expected an array");
    }

    // Transform to match expected prop shape
    movies.value = jsonResponse.map((movie, index) => ({
      order: index,
      id: movie.movieID,
      title: movie.title,
      poster_path: movie.posterPath,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
      runtime: movie.runtime,
      backdropPath: movie.backdropPath,
    }));

    console.log("Transformed watchlist movies:", watchlistMovies.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load watchlist movies';
    console.error("Error fetching watchlist:", err);
  } finally {
    loading.value = false;
  }
};

const fetchWatchlistTvShows = async () => {
  try {
    loading.value = true;
    const watchlistId = route.params.id;

    // Fetch watchlist details
    const watchlistResponse = await fetch(`/api/WatchList/${watchlistId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("apikey")}`
      }
    });

    if (!watchlistResponse.ok) {
      throw new Error('Failed to fetch watchlist details');
    }

    const watchlistData = await watchlistResponse.json();
    watchlistName.value = watchlistData.name;

    // Fetch movies in the watchlist
    const tvResponse = await fetch(`/api/WatchList/${watchlistId}/tv`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("apikey")}`
      }
    });

    if (!tvResponse.ok) {
      throw new Error(`HTTP error! Status: ${tvResponse.status}`);
    }

    const jsonResponse = await tvResponse.json();
    console.log("Raw API Response:", jsonResponse);

    if (!Array.isArray(jsonResponse)) {
      throw new Error("Invalid API response format: Expected an array");
    }

    // Transform to match expected prop shape
    tvShows.value = jsonResponse.map((tv, index) => ({
      order: index,
      id: tv.tvShowID,
      title: tv.originalName,
      poster_path: tv.posterPath,
      overview: tv.Overview,
      releaseDate: tv.firstAirDate,
      runtime: tv.runtime ?? "Unknown",
      backdropPath: tv.backdropPath,
    }));

    console.log("Transformed watchlist movies:", watchlistMovies.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load watchlist movies';
    console.error("Error fetching watchlist:", err);
  } finally {
    loading.value = false;
  }
};

const removeFromWatchlist = async (movie: Movie) => {
  try {
    const watchlistId = route.params.id;
    const response = await fetch(`/api/WatchList/${watchlistId}/movies/${movie.id}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("apikey")}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to remove movie from watchlist');
    }

    // // Option 1: Just remove from local state (preferred)
    // movies.value = movies.value.filter(m => m.id !== movie.id);

    // Option 2: Full refresh (if needed)
    await fetchWatchlistMovies(); // Re-fetch all data

  } catch (err) {
    console.error('Error removing movie from watchlist:', err);
    error.value = err instanceof Error ? err.message : 'Failed to remove movie';
  }
};

onMounted(() => {
  fetchWatchlistMovies();
});
</script>

<style scoped>
.container {
  background-color: rgb(34, 34, 34);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  overflow-y: auto;

  /* Centering styles */
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);

  margin: 0;
}

.loading {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.error {
  margin: 2rem 0;
}

.movie-grid {
  margin-bottom: 2rem;
}

.pagination-controls {
  display: flex;
  justify-content: center;
}
</style>
