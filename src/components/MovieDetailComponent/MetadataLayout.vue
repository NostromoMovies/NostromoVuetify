<template>
  <div class="background-container" :style="backgroundStyle">
    <div class="overlay"></div>
    <div class="header-section">
      <h1 class="movie-title-box">
        {{ selectedMovie?.title || "Loading..." }}
      </h1>
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
              <v-card outlined class="metadata-card">
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
  import { useMovieStore } from "@/stores/movieStore";

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
          {
            title: "Release Date",
            content: selectedMovie.value?.releaseDate
              ? new Date(selectedMovie.value.releaseDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })
              : "Unknown"
          },
          {
            title: "Runtime",
            content: selectedMovie.value?.runtime
              ? `${Math.floor(selectedMovie.value.runtime / 60)}h ${selectedMovie.value.runtime % 60}m`
              : "Unknown"
          }
        ];
      });

      const backgroundStyle = computed(() => ({
        backgroundImage: selectedMovie.value?.backdropPath
          ? `url(https://image.tmdb.org/t/p/w1280${selectedMovie.value.backdropPath})`
          : "none"
      }));

      return {
        selectedMovie,
        metadataBoxes,
        backgroundStyle
      };
    },
  };
</script>

<style scoped>
  .background-container {
    position: relative;
    width: 100vw;
    min-height: 100vh;
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
    background-attachment: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .custom-container {
    position: relative;
    z-index: 2;
    background: rgba(0, 0, 0, 0.7); 
    padding: 50px;
    border-radius: 10px;
  }

  .movie-title {
    padding-top: 20px;
  }

  .header-section {
    padding-top: 40px;
    text-align: center;
  }

  .metadata-card {
    background-color: rgb(34, 34, 34);
    color: #fff;
  }

  .movie-poster {
    background-color: red;
    max-width: 300px;
    max-height: 450px;
    margin: auto;
  }

  .movie-poster img {
    width: 100%;
    height: auto;
  }

  .movie-title-box {
    position: relative;
    z-index: 2;
    background-color: rgb(34, 34, 34);
    color: #fff;
    padding: 15px 20px;
    border-radius: 8px;
    text-align: center;
    margin: 20px auto;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }
</style>
