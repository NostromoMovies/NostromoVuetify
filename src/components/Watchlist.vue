<template>
  <v-container class="container">
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="loading"
    />
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
              {{ movies.length + tvShows.length }}
              {{ (movies.length + tvShows.length) === 1 ? 'item' : 'items' }}
            </v-chip>
          </h1>
          <v-divider class="my-4"/>
        </v-col>
      </v-row>

      <!-- Movies Grid -->
      <v-row class="movie-grid">
        <v-col
          v-for="movie in paginatedMovies"
          :key="`movie-${movie.id}`"
          cols="6" sm="4" md="3" lg="2" xl="2"
        >
          <WatchlistContainer
            :to="`/movie/${movie.id}`"
            :media-id="movie.id"
            :title="movie.title"
            :poster-path="movie.poster_path"
            media-type="movie"
            @removed="fetchWatchlistMovies"
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
      />
      <v-divider class="my-8"/>

      <!-- TV Shows Grid -->
      <v-row class="tv-grid">
        <v-col
          v-for="tv in tvShows"
          :key="`tv-${tv.id}`"
          cols="6" sm="4" md="3" lg="2" xl="2"
        >
          <WatchlistContainer
            :to="`/tv/${tv.id}`"
            :media-id="tv.id"
            :title="tv.title"
            :poster-path="tv.posterPath"
            media-type="tv"
            @removed="fetchWatchlistTvShows"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import WatchlistContainer from './collection/WatchlistContainer.vue'

interface ApiMovie {
  movieID?: number | null
  title: string
  posterPath?: string | null
}
interface ApiTvShow {
  tvShowID?: number | null
  originalName: string
  posterPath?: string | null
}

interface Movie { id: number; title: string; poster_path: string }
interface Tv { id: number; title: string; posterPath: string }

const route = useRoute()
const loading = ref(true)
const error = ref<string|null>(null)
const watchlistName = ref('My Watchlist')

const movies  = ref<Movie[]>([])
const tvShows = ref<Tv[]>([])
const currentPage  = ref(1)
const itemsPerPage = ref(20)

const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return movies.value.slice(start, start + itemsPerPage.value)
})
const totalPages = computed(() =>
  Math.ceil(movies.value.length / itemsPerPage.value)
)

async function fetchWatchlistMovies() {
  loading.value = true
  try {
    const id = route.params.id
    const resp = await fetch(`/api/WatchList/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('apikey')}` }
    })
    if (!resp.ok) throw new Error('Could not load watchlist')
    const { name } = await resp.json()
    watchlistName.value = name

    const list = await fetch(`/api/WatchList/${id}/movies`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('apikey')}` }
    }).then(r => r.json() as Promise<Array<ApiMovie | null>>)

    // filter out nulls and items missing movieID
    const valid = list.filter(m => m && typeof m.movieID === 'number') as ApiMovie[]

    movies.value = valid.map((m, i) => ({
      id: m.movieID!,
      title: m.title,
      poster_path: m.posterPath ?? ''
    }))
    currentPage.value = 1
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function fetchWatchlistTvShows() {
  loading.value = true
  try {
    const id = route.params.id
    const list = await fetch(`/api/WatchList/${id}/tv`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('apikey')}` }
    }).then(r => r.json() as Promise<Array<ApiTvShow | null>>)

    // filter nulls and missing tvShowID
    const valid = list.filter(tv => tv && typeof tv.tvShowID === 'number') as ApiTvShow[]

    tvShows.value = valid.map(tv => ({
      id:         tv.tvShowID!,
      title:      tv.originalName,
      posterPath: tv.posterPath ?? ''
    }))
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWatchlistMovies()
  fetchWatchlistTvShows()
})
</script>

<style scoped>
.container {
  background: #222;
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
}
.loading, .error { margin: 2rem 0; text-align: center }
.movie-grid, .tv-grid { margin-bottom: 2rem }
.pagination-controls { display: flex; justify-content: center }
</style>
