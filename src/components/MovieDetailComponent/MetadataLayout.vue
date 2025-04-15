<template>
  <div class="background-container" :style="backgroundStyle">
    <div class="overlay"></div>
    <div class="movie-title-box">
      <h1>{{ selectedMedia?.title || "Loading..." }}</h1>
    </div>

    <v-container class="custom-container" fluid>
      <v-row>
        <v-col cols="12" md="4">
          <v-card outlined class="movie-poster">
            <v-img v-if="selectedMedia?.posterPath"
                   :src="`https://image.tmdb.org/t/p/w500${selectedMedia.posterPath}`"
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
      <v-btn class="see-more-btn" @click="showCrews = !showCrews">
        {{ showCrews ? "See Less" : "See More" }}
      </v-btn>

      <v-row class="crew-container " v-if="showCrews">
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
    </v-container>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useMovieStore } from "@/stores/movieStore";
import { useCastStore } from "@/stores/castStore";
import { useCrewStore } from "@/stores/crewStore";
import { useTvStore } from "@/stores/tvStore";
import { useSeasonStore } from "@/stores/seasonStore";
import { useEpisodeStore } from "@/stores/episodeStore";
import { MediaTypes } from "@/enums/MediaTypeEnum";

export default {
  setup() {
    const route = useRoute();
    const movieStore = useMovieStore();
    const tvStore = useTvStore();
    const seasonStore = useSeasonStore();
    const episodeStore = useEpisodeStore();
    const castStore = useCastStore();
    const crewStore = useCrewStore();
    const showCrews = ref(false);

    const selectedMedia = ref(null);

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
      const mediaId = route.params.id as string;
      const mediaType = route.params.mediaType as string;

      if(mediaType === MediaTypes.Movie){
        await movieStore.fetchMovies();
        selectedMedia.value = movieStore.getMovieById?.(mediaId) || null;

        try {
          selectedCast.value = await castStore.fetchCastByMediaId(mediaId, mediaType);
        }
        catch (error) {
          console.error("Could not fetch cast for ID:", mediaId, error);
        }

        try {
          selectedCrew.value = await crewStore.fetchCrewByMediaId(mediaId, mediaType);
        }
        catch (error) {
          console.error("Could not fetch crew for ID:", mediaId, error);
        }

        try{
          await movieStore.getMovieRecommendation(mediaId);
        }
        catch (error) {
          console.error("Could not movie recommendations for ID:", mediaId, error);
        }
      }
      else if(mediaType === MediaTypes.Tv){
        await tvStore.fetchTvShows();
        selectedMedia.value = tvStore.getTvShowById?.(mediaId) || null;

        try {
          selectedCast.value = await castStore.fetchCastByMediaId(mediaId, mediaType);
        }
        catch (error) {
          console.error("Could not fetch cast for ID:", mediaId, error);
        }

        try {
          selectedCrew.value = await crewStore.fetchCrewByMediaId(mediaId, mediaType);
        }
        catch (error) {
          console.error("Could not fetch crew for ID:", mediaId, error);
        }

        try{
          await tvStore.getTvRecommendation(mediaId);
        }
        catch (error) {
          console.error("Could not tv show recommendations for ID:", mediaId, error);
        }
      }




    });

    const metadataBoxes = computed(() => {
      if (!selectedMedia.value) return "Loading movie details...";

      return `
         <strong style="font-size: 20px; display: block; margin-bottom: 5px;">Overview:</strong> ${selectedMedia.value.overview ?? "N/A"} <br><br>

        <strong style="font-size: 20px; display: block; margin-bottom: 5px;">Release Date:</strong> ${selectedMedia.value.releaseDate
          ? new Date(selectedMedia.value.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
          : "Unknown"
        } <br><br>

        <strong style="font-size: 20px; display: block; margin-bottom: 5px;">Runtime:</strong> ${selectedMedia.value.runtime
          ? `${Math.floor(Number(selectedMedia.value.runtime) / 60)}h ${Number(selectedMedia.value.runtime) % 60}m`
          : "Unknown"
        }
      `;
    });

    const backgroundStyle = computed(() => ({
      backgroundImage: selectedMedia.value?.backdropPath
        ? `url(https://image.tmdb.org/t/p/w1280${selectedMedia.value.backdropPath})`
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
      selectedMedia,
      metadataBoxes,
      backgroundStyle,
      actors,
      crewMembers,
      showCrews
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

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.crew-container, .actor-container {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  padding-top: 10px;
  word-wrap: break-word;
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
  justify-content: space-between;
  background-color: rgb(44, 44, 44);
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

.text-center{
  word-wrap: break-word;
}

.title-row{
  padding: 20px;
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
</style>
