<template>
  <div>
    <!-- Movie Title and Redirect Link -->
    <div class="header-section">
      <v-btn class="redirect-btn" color="primary" outlined @click="redirectToDashboard">
        Collection >
      </v-btn>
      <h1 class="movie-title">{{ selectedMovie?.title || "Loading..." }}</h1>
    </div>

    <v-container class="custom-container" fluid>
      <v-row>
        <v-col cols="12" md="4">
          <v-card outlined class="movie-poster">
            <v-img v-if="selectedMovie?.posterPath"
                   :src="`https://image.tmdb.org/t/p/w500${selectedMovie.posterPath}`"
                   alt="Movie Poster"
                   aspect-ratio="2/3"></v-img>
            <p v-else>No Poster Available</p>
          </v-card>
        </v-col>

        <!-- Metadata Section -->
        <v-col cols="12" lg="8">
          <v-row>
            <v-col cols="12" md="6" v-for="(metadata, index) in metadataBoxes" :key="index">
              <v-card outlined>
                <v-card-title>{{ metadata.title }}</v-card-title>
                <v-card-text>{{ metadata.content }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import { ref, onMounted, computed, watch } from "vue";
  import { useMovieStore } from "@/stores/moviestore";

  export default {
    setup() {
      const movieStore = useMovieStore();
      const selectedMovie = ref(null);

      onMounted(async () => {
        await movieStore.fetchMovies();
        if (movieStore.movies.value.length > 0) {
          selectedMovie.value = { ...movieStore.movies.value[0] };
          console.log("Selected Movie Data:", selectedMovie.value);
        }
      });

      watch(selectedMovie, (newVal) => {
        console.log("Updated Selected Movie:", newVal);
      });

      const metadataBoxes = computed(() => {
        if (!selectedMovie.value) return [];
        return [
          { title: "Overview", content: selectedMovie.value?.overview ?? "N/A" },
          { title: "Release Year", content: selectedMovie.value?.releaseDate ? selectedMovie.value.releaseDate.split("-")[0] : "Unknown" },
          { title: "Runtime", content: selectedMovie.value?.runtime ? `${selectedMovie.value.runtime} minutes` : "Unknown" },
        ];
      });

      return {
        selectedMovie,
        metadataBoxes,
        redirectToDashboard: () => {
          window.location.href = "/dashboard";
        }
      };
    },
  };
</script>

<style scoped>
  .movie-title {
    padding-top: 20px;
  }

  .redirect-btn {
    font-size: 10px;
  }

  .header-section {
    padding-top: 40px;
    text-align: center;
  }

  .custom-container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 100px;
  }

  .movie-poster {
    background-color: red;
  }
</style>
