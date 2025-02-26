<template>
  <div class="background-container" :style="backgroundStyle">
    <div class="overlay"></div>

    <div class="movie-title-box">
      <h1>{{ selectedMovie?.title || "Loading..." }}</h1>
    </div>

    <v-container class="custom-container" fluid>
      <v-row>
        <v-col cols="12" md="4">
          <v-card outlined class="movie-poster">
            <v-img
              v-if="selectedMovie?.posterPath"
              :src="`https://image.tmdb.org/t/p/w500${selectedMovie.posterPath}`"
              alt="Movie Poster"
              aspect-ratio="2/3"
            />
            <p v-else>No Poster Available</p>
          </v-card>
        </v-col>

        <v-col cols="12" lg="8">
          <v-row>
            <v-col
              cols="12"
              md="6"
              v-for="(metadata, index) in metadataBoxes"
              :key="index"
            >
              <v-card outlined class="metadata-card">
                <v-card-title>{{ metadata.title }}</v-card-title>
                <v-card-text>{{ metadata.content }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="crew-container">
        <v-col cols="12">
          <div class="crew-row">
            <div class="crew-col" v-for="crew in crewMembers" :key="crew.id">
              <v-card outlined class="crew-card">
                <v-img
                  width="120"
                  height="120"
                  :src="crew.image"
                  alt="Crew Image"
                  aspect-ratio="1"
                />
                <v-card-title class="text-center">
                  {{ crew.name }}
                </v-card-title>
                <v-card-subtitle class="text-center" v-if="crew.job">
                  {{ crew.job }}
                </v-card-subtitle>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row class="actor-container">
        <v-col cols="12">
          <div class="actor-row">
            <div class="actor-col" v-for="actor in actors" :key="actor.id">
              <v-card outlined class="actor-card">
                <v-img
                  width="120"
                  height="120"
                  :src="actor.image"
                  alt="Actor Image"
                  aspect-ratio="1"
                />
                <v-card-title class="text-center">
                  {{ actor.name }}
                </v-card-title>
                <v-card-subtitle class="text-center" v-if="actor.character">
                  {{ actor.character }}
                </v-card-subtitle>
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
import { useRoute } from "vue-router";
import { useMovieStore } from "@/stores/movieStore";
import { useCastStore } from "@/stores/castStore";
import { useCrewStore } from "@/stores/crewStore";

export default {
  setup() {
    const route = useRoute();
    const movieStore = useMovieStore();
    const castStore = useCastStore();
    const crewStore = useCrewStore();

    const selectedMovie = ref(null);
    const selectedCast = ref([]);
    const selectedCrew = ref([]);

    const jobPriority = {
      "Director": 1,
      "Screenplay": 2,
      "Executive Producer": 3,
      "Producer": 4,
      "Director of Photography": 5,
      "Editor": 6,
      "Production Designer": 7,
      "Original Music Composer": 8,
      "Visual Effects Supervisor": 9,
      "Sound Designer": 10
    };

    onMounted(async () => {
      await movieStore.fetchMovies();
      const movieId = route.params.id as string;
      selectedMovie.value = movieStore.getMovieById?.(movieId) || null;

      try {
        selectedCast.value = await castStore.fetchCastByMovieId(movieId);
      } catch (error) {
        console.error("Could not fetch cast for ID:", movieId, error);
      }

      try {
        selectedCrew.value = await crewStore.fetchCrewByMovieId(movieId);
      } catch (error) {
        console.error("Could not fetch crew for ID:", movieId, error);
      }
    });

    const metadataBoxes = computed(() => selectedMovie.value ? [
      { title: "Overview", content: selectedMovie.value.overview ?? "N/A" },
      { 
        title: "Release Date", 
        content: selectedMovie.value.releaseDate
          ? new Date(selectedMovie.value.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
          : "Unknown"
      },
      { 
        title: "Runtime", 
        content: selectedMovie.value.runtime
          ? `${Math.floor(Number(selectedMovie.value.runtime) / 60)}h ${Number(selectedMovie.value.runtime) % 60}m`
          : "Unknown"
      }
    ] : []);

    const backgroundStyle = computed(() => ({
      backgroundImage: selectedMovie.value?.backdropPath
        ? `url(https://image.tmdb.org/t/p/w1280${selectedMovie.value.backdropPath})`
        : "none"
    }));

    const actors = computed(() => selectedCast.value.map(c => ({
      id: c.id,
      name: c.name || "Unknown Actor",
      image: c.profilePath ? `https://image.tmdb.org/t/p/w200${c.profilePath}` : "https://via.placeholder.com/100",
      character: c.character || ""
    })));

    const crewMembers = computed(() => selectedCrew.value
      .filter(c => c.profilePath && jobPriority.hasOwnProperty(c.job))
      .sort((a, b) => (jobPriority[a.job] || 999) - (jobPriority[b.job] || 999))
      .map(c => ({
        id: c.id,
        name: c.name || "Unknown Crew Member",
        image: `https://image.tmdb.org/t/p/w200${c.profilePath}`,
        job: c.job || ""
      }))
    );

    return {
      selectedMovie,
      metadataBoxes,
      backgroundStyle,
      actors,
      crewMembers,
    };
  }
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
  max-width: 1400px;
}

.movie-title-box {
  position: relative;
  z-index: 2;
  background-color: rgb(34, 34, 34);
  color: #fff;
  padding: 15px 20px;
  border-radius: 8px;
  text-align: center;
  width: fit-content;
  margin: 20px auto;
}

.crew-container, .actor-container {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  padding-top: 10px;
}

.crew-row, .actor-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 15px;
}

.crew-card, .actor-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(44, 44, 44);
  color: #fff;
  text-align: center;
  padding: 10px;
}
</style>