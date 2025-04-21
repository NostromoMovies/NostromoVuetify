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
      <v-dialog v-model="showDialog" max-wid  ="500">
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
              item-value="id"
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
import { ref } from 'vue';
import { getService } from '@/api/GetService';
const darkMode = ref(true);
const props = defineProps({
  to: { type: String, required: true },
  movieId: { type: Number, required: true },
  title: { type: String, required: true }
});

const posterImage = ref(`/api/movies/${props.movieId}/poster`);
const showDialog = ref(false);
const watchlists = ref([]);
const selectedWatchlist = ref(null);

const handleAddButton = async () => {
  try {
    const response = await getService.getWatchlists();
    watchlists.value = response.data;
    showDialog.value = true;
  } catch (error) {
    console.error("Error fetching watchlists:", error);
  }
};

const addToWatchlist = async () => {
  if (!selectedWatchlist.value) return;
  
  try {
    await getService.addMovieToWatchlist(
      selectedWatchlist.value,
      props.movieId
    );
    showDialog.value = false;
    
  } catch (error) {
    console.error("Error adding to watchlist:", error);
   
  }
};

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = 'https://placehold.co/300x450?text=No+Poster';
};
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