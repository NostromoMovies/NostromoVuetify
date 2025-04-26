<template>
  <div class="movie-card">
    <router-link :to="to" class="poster-link">
      <div class="poster-container">
        <img :src="posterImage" alt="Poster" class="poster-image" @error="handleImageError" />
        <div class="overlay">
          <!-- <div class="movie-title">{{ title }}</div> -->
        </div>
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

      <!-- Add Button -->
      <v-btn
        color="secondary"
        variant="outlined"
        block
        class="action-button"
        prepend-icon="mdi-plus"
        @click="showDialog = true"
      >
        Add
      </v-btn>


      

      <!-- Add to Watchlist Dialog -->
      <v-dialog v-model="showDialog" max-width  ="500">
        <v-card v-card :theme="darkMode ? 'dark' : 'light'">
          <v-card-title class="text-h5">
            Add to Watchlist
          </v-card-title>

          <v-card-text>
            <v-select
              v-model="selectedWatchlist"
              :items="watchlists"
              label="Select watchlist"
              item-title="name"
              item-value="watchListID"
              variant="outlined"
            ></v-select>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey-darken-1"
              variant="text"
              @click="showDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              variant="text"
              @click="addToWatchlist"
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">



import { onMounted, ref, watch } from 'vue';
import { getService } from '@/api/GetService';


const darkMode = ref(true);
const showDialog = ref(false);
const selectedWatchlist = ref(null);

const props = defineProps({
  to: { type: String, required: true },
  mediaId: { type: Number, required: true },
  title: { type: String, required: true },
  mediaType: { type: String, required: true }
});
interface Watchlist {
  watchListID: number
  name: string
  userID: number

}

const watchlists = ref<Watchlist[]>([])

// Load watchlists 
const loadWatchlists = async () => {
  try {
    const response = await fetch("/api/watchlist/all", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("apikey")}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error('Failed to fetch watchlists');
    
    const fetched = await response.json();
    watchlists.value = fetched || [];
    console.log("Loaded watchlists:", watchlists.value);
  } catch (error) {
    console.error("Failed to fetch user watchlists:", error);
  }
};

const addToWatchlist = async () => {
  if (!selectedWatchlist.value) return;

  try {
    console.log(`Adding media ${props.mediaId} to watchlist ${selectedWatchlist.value}`);
    await getService.addMovieToWatchlist(
      selectedWatchlist.value, 
      props.mediaId           
    );
    showDialog.value = false;

  } catch (error) {
    console.error("Error adding to watchlist:", error);

  }
};;

  const posterImage = ref(
      props.mediaType === 'movie'
        ? `/api/movies/${props.mediaId}/poster`
        : `/api/tvshow/${props.mediaId}/poster`
      );

  const fetchPoster = async () => {
    try {
      console.log("Ran")
      const response = await fetch(posterImage.value, { method: 'HEAD' });

      if (!response.ok) {
        await getService.getPoster(props.mediaType, props.mediaId);
        setTimeout(() => {
          posterImage.value = (
          props.mediaType === 'movie'
            ? `/api/movies/${props.mediaId}/poster?reload=${Date.now()}`
            : `/api/tvshow/${props.mediaId}/poster?reload=${Date.now()}`
          );
        }, 2000);
      }
    } catch {
      posterImage.value = 'https://placehold.co/300x450?text=No+Poster';
    }
  };

  watch(
    () => [props.mediaId, props.mediaType],
    () => {
      //console.log('watch triggered with:', { mediaId, mediaType });

      fetchPoster();

    },
    { immediate: true }
  );



  const playVideo = async () => {
    try {
      // Ensure mediaId is a valid number
      if (typeof props.mediaId !== 'number' || isNaN(props.mediaId)) {
        throw new Error("Invalid movie ID");
      }

      console.log("Requesting video for movie ID:", props.mediaId);

      const response = await getService.getVideoID(Number(props.mediaId));
      const videoId = response.data;

      if (!videoId || videoId < 0) {
        throw new Error("Invalid video ID received");
      }

      const streamUrl = await getService.getVideoStream(videoId);
      // Do something with streamUrl

    } catch (err) {
      console.error("Failed to play video:", err);

    }
  };


  const handleImageError = (e: Event) => {
    (e.target as HTMLImageElement).src = 'https://placehold.co/300x450?text=No+Poster';
  };


  onMounted(() => {
  loadWatchlists();
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
  padding-top: 150%; /* 2:3 aspect ratio */
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
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
  padding: 16px;
}

.movie-title {
  color: white;
  font-weight: bold;
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
