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
            <v-img v-if="selectedMovie?.posterPath"
                   :src="`https://image.tmdb.org/t/p/w500${selectedMovie.posterPath}`"
                   alt="Movie Poster"
                   aspect-ratio="2/3" />
            <p v-else>No Poster Available</p>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card outlined class="metadata-card">
            <v-card-text v-html="metadataBoxes"></v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Combined Cast header and See More button -->
      <v-row  class="cast-header-row">
        <v-col cols="auto">
          <h2>Cast</h2>
        </v-col>
      </v-row>

      <v-row class="actor-container">
        <v-col cols="12">
          <div class="actor-row">
            <div class="actor-col" v-for="(actor, index) in actors.slice(0, 10)" :key="actor.id">
              <v-card outlined class="actor-card">
                <v-img width="120"
                      height="120"
                      :src="actor.image"
                      alt="Actor Image"
                      aspect-ratio="1" />
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

      <v-row class="crew-container" v-if="showCrews">
        <v-col cols="12">
          <div class="crew-row">
            <div class="crew-col" v-for="crew in crewMembers" :key="crew.id">
              <v-card outlined class="crew-card">
                <v-img width="120"
                      height="120"
                      :src="crew.image"
                      alt="Crew Image"
                      aspect-ratio="1" />
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


      <v-row  class="cast-header-row">
        <v-col cols="auto">
          <h2>Recommendations</h2>
        </v-col>
      </v-row>
 
      <v-row class="movie-recommendation-container">
        <v-col cols="12">
          <div class="recommendation-row">
            <div class="recommendation-col" v-for="movie in movieRecommendation" :key="movie.id">
              <v-card outlined class="recommendation-card">
                <v-img width="120"
                      height="120"
                      :src="movie.image"
                      alt="Movie Poster"
                      aspect-ratio="1" />
                <v-card-title class="text-center">
                  {{ movie.name }}
                </v-card-title>
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
    const showCrews = ref(false);

    const selectedMovie = ref(null);
    const selectedCast = ref([]);
    const selectedCrew = ref([]);
    const selectedMovieRecommendation = ref([]);

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

      selectedMovie.value = movieStore.getMovieById?.(movieId);

      if (!selectedMovie.value) {
        try {
          const resp = await fetch(`/api/movies/id/${movieId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('apikey')}`,
              'Content-Type': 'application/json'
            }
          });

          if (!resp.ok) throw new Error('Failed to fetch single movie details');

          const envelope = await resp.json();
          const movie = envelope.data;

          console.log('API response data 👉', movie);

          selectedMovie.value = {
            movieID: movie.tmdbMovieId,
            title: movie.title,
            overview: movie.overview,
            releaseDate: movie.releaseDate,
            runtime: movie.runtime,
            posterPath: movie.posterPath,
            backdropPath: movie.backdropPath
          };
        } catch (err) {
          console.error('Failed to fetch movie metadata:', err);
        }
      }

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

      try {
        selectedMovieRecommendation.value = await movieStore.getMovieRecommendation(movieId);
        console.log("Recommendations loaded:", selectedMovieRecommendation.value);
      } catch (error) {
        console.error("Could not fetch movie recommendations for ID:", movieId, error);
      }
    });

    const metadataBoxes = computed(() => {
      if (!selectedMovie.value) return "Loading movie details...";

      return `
        <strong style="font-size: 20px; display: block; margin-bottom: 5px;">Overview:</strong> ${selectedMovie.value.overview ?? "N/A"} <br><br>
        <strong style="font-size: 20px; display: block; margin-bottom: 5px;">Release Date:</strong> ${selectedMovie.value.releaseDate
          ? new Date(selectedMovie.value.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
          : "Unknown"
        } <br><br>
        <strong style="font-size: 20px; display: block; margin-bottom: 5px;">Runtime:</strong> ${selectedMovie.value.runtime
          ? `${Math.floor(Number(selectedMovie.value.runtime) / 60)}h ${Number(selectedMovie.value.runtime) % 60}m`
          : "Unknown"
        }
      `;
    });

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

    const movieRecommendation = computed(() => {
      if (!selectedMovieRecommendation.value || selectedMovieRecommendation.value.length === 0) {
        return [];
      }
      return selectedMovieRecommendation.value.map(movie => ({
        id: movie.id,
        image: movie.posterPath 
          ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` 
          : "https://via.placeholder.com/500x750?text=No+Poster",
        name: movie.title
      }));
    });

    return {
      selectedMovie,
      metadataBoxes,
      backgroundStyle,
      actors,
      crewMembers,
      showCrews,
      movieRecommendation
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
  padding-bottom: 80px;
  border-radius: 10px;
  height: 100%;
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
  margin: 40px auto 20px;
}

.crew-container, 
.actor-container,
.movie-recommendation-container {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  padding-top: 10px;
  margin-top: 20px;
}

.actor-row,
.crew-row,
.recommendation-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 15px;
  padding-bottom: 10px;
}

.actor-card,
.crew-card,
.recommendation-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  text-align: center;
  padding: 10px;
  background-color: transparent !important;
  box-shadow: none !important;
  min-height: 270px;
  width: 200px;
  word-wrap: break-word;
  overflow: hidden;
}

.recommendation-card {
  min-height: 300px;
}

.text-center {
  word-wrap: break-word;
  white-space: normal;
}

.see-more-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 3;
  background-color: rgb(34,34,34);
  color: white;
}

.metadata-card {
  background-color: rgb(34,34,34);
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: white;
  margin-top: 30px;
  margin-bottom: 15px;
}


.cast-header-row {
  margin-top: 20px;
  margin-bottom: 10px;
  align-items: center;
}

.see-more-btn {
  margin-left: 16px;
  background-color: rgb(34,34,34);
  color: white;
}

/* Rest of your existing styles... */
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

</style>
