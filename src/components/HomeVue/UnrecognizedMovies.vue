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
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useNavigationStore } from "@/stores/useNavigationStore";

const navigationStore = useNavigationStore();
const movies = ref([]);

const fetchUnrecognizedMovies = async () => {
  try {
    const response = await axios.get("http://localhost:8112/api/MediaDisplay/unrecognized-movies");
    if (Array.isArray(response.data)) {
      movies.value = response.data;
    } else {
      console.error("Unexpected response structure:", response.data);
    }
  } catch (error) {
    console.error("Error fetching unrecognized movies:", error);
  }
};

const navigateToMovieMatching = () => {
  navigationStore.navigateToUnrecognizedMovies();
};

onMounted(fetchUnrecognizedMovies);
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
