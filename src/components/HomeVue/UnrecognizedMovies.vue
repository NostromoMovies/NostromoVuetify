<template>
  <v-container>
    <v-card class="unrecognized-card" @click="navigateToMovieMatching">
      <v-card-title>Unrecognized Movies</v-card-title>
      <v-card-text>
        <div v-if="movies.length > 0" class="movies-container">
          <p>{{ movies.length }} unrecognized movies found.</p>
        </div>
        <div v-else class="no-movies">No unrecognized movies found</div>
      </v-card-text>
    </v-card>

    <!-- Notification for unrecognized movies -->
    <v-snackbar v-model="showUnrecognizedNotification" color="warning" :timeout="3000" location="top">
      <v-icon start>mdi-alert</v-icon>
      {{ movies.length }} new unrecognized movies found!
      <template v-slot:actions>
        <v-btn variant="text" @click="showUnrecognizedNotification = false">Close</v-btn>
      </template>
    </v-snackbar>

    <!-- Notification for recognized movies -->

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useNavigationStore } from "@/stores/useNavigationStore";

const navigationStore = useNavigationStore();
const movies = ref([]);
const showUnrecognizedNotification = ref(false);
const showRecognizedNotification = ref(false);
const previousCount = ref(0);
const shouldRefresh = ref(false);

const fetchUnrecognizedMovies = async () => {
  try {
    const response = await axios.get("http://localhost:8112/api/MediaDisplay/unrecognized-movies");
    if (Array.isArray(response.data)) {
      const newCount = response.data.length;
      
      if (newCount > previousCount.value) {
        showUnrecognizedNotification.value = true;
      }
      
      previousCount.value = newCount;
      movies.value = response.data;
    } else {
      console.error("Unexpected response structure:", response.data);
    }
  } catch (error) {
    console.error("Error fetching unrecognized movies:", error);
  }
};

const handleSnackbarClose = (isVisible: boolean) => {
  if (!isVisible && shouldRefresh.value) {
    window.location.reload();
  }
};

const simulateRecognition = () => {
  setTimeout(() => {
    if (movies.value.length > 0) {
      showRecognizedNotification.value = true;
      shouldRefresh.value = true;
      movies.value.pop();
    }
  }, 5000);
};

const navigateToMovieMatching = () => {
  navigationStore.navigateToUnrecognizedMovies();
};

onMounted(() => {
  fetchUnrecognizedMovies();
  setInterval(fetchUnrecognizedMovies, 60000);
  simulateRecognition(); // Remove this in production
});

watch(movies, (newVal, oldVal) => {
  if (newVal.length < oldVal.length) {
    showRecognizedNotification.value = true;
    shouldRefresh.value = true;
  }
}, { deep: true });
</script>

<style scoped>
.unrecognized-card {
  background-color: rgb(34, 34, 34);
  color: white !important;
  box-shadow: none !important;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.unrecognized-card:hover {
  background-color: rgb(24, 24, 24);
}

.movies-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.no-movies {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>