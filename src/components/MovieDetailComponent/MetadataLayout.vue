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

      <!-- Actor Section -->
      <h2 class="text-white">Top Cast</h2>
      <v-row class="actor-container">
        <v-col cols="12">
          <div class="actor-row">
            <div class="actor-col" v-for="actor in actors" :key="actor.id">
              <v-card outlined class="actor-card">
                <v-img :src="actor.image" alt="Actor Image" aspect-ratio="1"></v-img>
                <v-card-title class="text-center">{{ actor.name }}</v-card-title>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from "vue";
import { useMovieStore } from "@/stores/movieStore";

interface Actor {
  id: number;
  name: string;
  image: string;
}

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

    const actors: Actor[] = [
      { id: 1, name: "Actor 1", image: "https://via.placeholder.com/100" },
      { id: 2, name: "Actor 2", image: "https://via.placeholder.com/100" },
      { id: 3, name: "Actor 3", image: "https://via.placeholder.com/100" },
      { id: 4, name: "Actor 4", image: "https://via.placeholder.com/100" },
      { id: 5, name: "Actor 5", image: "https://via.placeholder.com/100" },
      { id: 6, name: "Actor 6", image: "https://via.placeholder.com/100" },
      { id: 7, name: "Actor 7", image: "https://via.placeholder.com/100" },
      { id: 8, name: "Actor 8", image: "https://via.placeholder.com/100" },
    ];

    return {
      selectedMovie,
      metadataBoxes,
      backgroundStyle,
      actors
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
  padding: 20px;
}

.custom-container {
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.7); 
  padding: 50px;
  border-radius: 10px;
  width: 100%;
  max-width: 1400px; /* Adjust as needed */
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

.actor-container {
  display: flex;
  justify-content: left; /* Center horizontally */
  /* align-items: ; Center vertically */
  width: 60%; /* Set width to 60% of the parent */
  overflow-x: auto; /* Enable horizontal scrolling */
  white-space: nowrap; /* Prevent wrapping of actor cards */
  padding-top: 20px; /* Add some padding */
  /* padding-left: 100px; */
  left: 100px;
  
  /* margin: 0 auto; Center the container */

}

.text-white {
  text-align: left; /* Center the text */
  width: 100%; /* Ensure it takes full width */
  padding-left: 55px;
}

.actor-row {
  display: flex;
  flex-wrap: nowrap; /* Ensure actors stay in a single row */
  gap: 25px; /* Add spacing between actor cards */
}

.actor-col {
  flex: 0 0 auto; /* Prevent resizing of actor cards */
  min-width: 120px; /* Set a minimum width for each actor card */
}

.actor-card {
  background-color: rgb(34, 34, 34);
  color: #fff;
  text-align: center;
}
</style>