<template>
  <div class="movie-card">
    <router-link :to="to" class="poster-link">
      <div class="poster-container">
        <img :src="posterImage" alt="Poster" class="poster-image" @error="handleImageError" />
        <div class="overlay"></div>
      </div>
    </router-link>

    <div class="button-stack">
      <!-- Play Button -->
      <v-btn
        color="primary"
        variant="flat"
        block
        class="action-button"
        prepend-icon="mdi-play"
        @click="playVideo"
      >
        Play
      </v-btn>

      <!-- Remove Button -->
      <v-btn
        color="secondary"
        variant="outlined"
        block
        class="action-button"
        prepend-icon="mdi-trash-can"
        @click="showDialog = true"
      >
        Remove
      </v-btn>

      <!-- Confirm Delete Dialog -->
      <v-dialog v-model="showDialog" max-width="400">
        <v-card :theme="darkMode ? 'dark' : 'light'">
          <v-card-title class="dark-header">Confirm Delete</v-card-title>
          <v-card-text class="dark-body">
            Are you sure you want to remove {{ title }} from {{ watchlistName }}?
          </v-card-text>
          <v-card-actions class="dark-actions">
            <v-spacer></v-spacer>
            <v-btn text @click="showDialog = false" class="dark-cancel">Cancel</v-btn>
            <v-btn color="error" @click="removeFromWatchlist" class="dark-confirm">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { getService } from '@/api/GetService';

const route = useRoute();
const showDialog = ref(false);
const darkMode = ref(true);
const watchlistName = ref('My Watchlist');

const props = defineProps({
  to: { type: String, required: true },
  mediaId: { type: Number, required: true },
  title: { type: String, required: true },
  mediaType: { type: String, required: true }
});

const selectedWatchlist = ref<number | null>(null);
const posterImage = ref('');

const fetchWatchlistMovies = async () => {
  try {
    console.log("Received props:", props);
    const watchlistId = Number(route.params.id);
    if (isNaN(watchlistId)) return;

    selectedWatchlist.value = watchlistId;

    const res = await fetch(`/api/WatchList/${watchlistId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('apikey')}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch watchlist details');
    const data = await res.json();
    watchlistName.value = data.name;
  } catch (err) {
    console.error(err);
  }
};

const removeFromWatchlist = async () => {
  if (!selectedWatchlist.value) return;
  try {
    console.log(props.mediaId)
    await getService.removeFromWatchlist(selectedWatchlist.value, props.mediaId);
    showDialog.value = false;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
  }
};

const fetchPoster = async () => {
  posterImage.value =
    props.mediaType === 'movie'
      ? `/api/movies/${props.mediaId}/poster`
      : `/api/tvshow/${props.mediaId}/poster`;

  try {
    const response = await fetch(posterImage.value, { method: 'HEAD' });
    if (!response.ok) {
      await getService.getPoster(props.mediaType, props.mediaId);
      setTimeout(() => {
        posterImage.value =
          (props.mediaType === 'movie'
            ? `/api/movies/${props.mediaId}/poster?reload=`
            : `/api/tvshow/${props.mediaId}/poster?reload=`) + Date.now();
      }, 2000);
    }
  } catch {
    posterImage.value = 'https://placehold.co/300x450?text=No+Poster';
  }
};

watch(
  () => [props.mediaId, props.mediaType],
  () => {
    fetchPoster();
  },
  { immediate: true }
);

const playVideo = async () => {
  try {
    if (typeof props.mediaId !== 'number' || isNaN(props.mediaId)) {
      throw new Error('Invalid movie ID');
    }

    const response = await getService.getVideoID(props.mediaId);
    const videoId = response.data;

    if (!videoId || videoId < 0) {
      throw new Error('Invalid video ID received');
    }

    const streamUrl = await getService.getVideoStream(videoId);
    // Handle playing the video using streamUrl
  } catch (err) {
    console.error('Failed to play video:', err);
  }
};

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = 'https://placehold.co/300x450?text=No+Poster';
};

onMounted(() => {
  fetchWatchlistMovies();
  fetchPoster();
});
</script>

<style scoped>
.movie-card {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.poster-link {
  display: block;
  text-decoration: none;
  position: relative;
}

.poster-container {
  position: relative;
  width: 100%;
  padding-top: 150%;
  overflow: hidden;
}

.poster-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.poster-link:hover .poster-image {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 16px;
}

.button-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.action-button {
  margin: 0 !important;
}
</style>
