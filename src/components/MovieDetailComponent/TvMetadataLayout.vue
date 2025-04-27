<template>
  <div class="background-container" :style="backgroundStyle">
    <div class="overlay"></div>
    <div class="movie-title-box">
      <h1>{{ selectedMedia?.title || selectedMedia?.originalName || selectedMedia?.episodeName|| "Loading..." }}</h1>
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

      <v-select
            v-if="isTv"
            v-model="selectedSeason"
            :items="seasonDropdown"
            item-title="name"
            item-value="id"
            label="Select a Season"
            outlined
            dense
            class="w-33 mt-4"

          />

      <v-container class="episode-container" fluid
        v-if="isTv">
        <v-row>
          <v-col cols="12" md="12" lg="12" class="mt-4">
            <v-card outlined class="Episode-card pa-4 rounded-lg"
              style="height: 513px; background-color: rgb(34,34,34);">
              <div :class="episodes.length > 3 ? 'episode-scroll-snap' : 'episode-no-scroll'" >
                <v-card
                v-for="episode in episodes"
                :key="episode.id"
                :to="`/season/${selectedSeason}/episode/${episode.id}`"
                outlined class="Episode-card pa-2 d-flex align-start rounded-lg mb-4 snap-card"
                style="height: 150px; background-color: #4f4f4f;" elevation="5">

                    <v-img
                      :src="episode.stillPath"
                      height = 160px
                      max-width = 200px
                      min-width= 200px
                      class="mr-4 rounded"
                      cover
                    />

                    <v-col class="flex-grow-1 pa-0 text-left" style="min-width: 0;">
                      <v-card-title class="text-white text-h6 font-weight-bold py-1">
                        {{episode.name}}
                      </v-card-title>

                      <v-card-subtitle
                        class="text-white text-caption py-0"
                        style="height: 7em; overflow: hidden; text-overflow: ellipsis; white-space: normal; display: block;">
                        {{ episode.description }}
                      </v-card-subtitle>
                    </v-col>

                    <v-col class="shrink mt-4 d-flex justify-end" cols="auto">
                      <v-btn icon variant="elevated">
                        <v-icon>mdi-play</v-icon>
                      </v-btn>
                    </v-col>
                  <!-- </v-list-item> -->
                </v-card>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container  fluid>
        <v-row>
          <v-col cols="12" md="12" lg="12" class="mt-4">
            <v-card outlined class="pa-4 rounded-lg"
            style="height: 300px; background-color: rgb(34,34,34);">
              <v-row class="actor-container"  >
                <v-col cols="12">
                  <div class="actor-row">
                    <div class="actor-col" v-for="(actor, index) in actors.slice(0, 10)" :key="actor.id">
                      <v-card outlined class="actor-card">
                        <v-img width="120"
                              height="120"
                              :src="actor.image"
                              class="mr-4 rounded"
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
            </v-card>
          </v-col>
        </v-row>
      </v-container>


      <v-btn class="see-more-btn" @click="showCrews = !showCrews">
        {{ showCrews ? "See Less" : "See More" }}
      </v-btn>

      <v-container  fluid>
        <v-row>
          <v-col cols="12" md="12" lg="12" class="mt-4">
            <v-card outlined class="pa-4 rounded-lg"
            style="height: 300px; background-color: rgb(34,34,34);">
            <v-card-title style="color: white; font-size: x-large; font-weight: bold; text-align: left;">
              Crew
            </v-card-title>


              <v-row class="crew-container " v-if="showCrews">
                <v-col cols="12">
                  <div class="crew-row">
                    <div class="crew-col" v-for="crew in crewMembers" :key="crew.id">
                      <v-card outlined class="crew-card">
                        <v-img width="120"
                              height="120"
                              :src="crew.image"
                              class="mr-4 rounded"
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
            </v-card>
          </v-col>
        </v-row>
      </v-container>

    </v-container>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useMovieStore } from "@/stores/movieStore";
import { useTvCastStore } from "@/stores/tvCastStore";
import { useTvCrewStore } from "@/stores/tvCrewStore";
import { useTvStore } from "@/stores/tvStore";
import { useSeasonStore } from "@/stores/seasonStore";
import { useEpisodeStore } from "@/stores/episodeStore";
import { MediaTypes } from "@/enums/MediaTypeEnum";
import { ro } from "vuetify/locale";

export default {
  setup() {
    const route = useRoute();
    const mediaType = ref("");
    const seasonId = ref("");
    const episodeId = ref("");
    const movieStore = useMovieStore();
    const tvStore = useTvStore();
    const seasonStore = useSeasonStore();
    const episodeStore = useEpisodeStore();
    const castStore = useTvCastStore();
    const crewStore = useTvCrewStore();
    const showCrews = ref(false);

    const selectedMedia = ref(null);

    const selectedCast = ref([]);
    const selectedCrew = ref([]);
    const seasonDropdown = ref<{id: number; name: string; number: number}[]>([]);
    const selectedSeason = ref<number | null>(null);
    const episodes = ref<{id: number; name: string; description: string; number: number; stillPath: string }[]>([]);

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

      console.log("Fetched season names: ", seasonDropdown.value);
      const mediaId = route.params.id as string;
      mediaType.value = MediaTypes.Tv;

     if(mediaType.value === MediaTypes.Tv){
        const seasonArr = await seasonStore.fetchSeasonsByTvShowId(Number(mediaId));
        seasonDropdown.value = seasonArr.sort((a, b) => a.seasonNumber - b.seasonNumber)
                                    .map(season => ({
                                      id: season.seasonID,
                                      name: season.seasonName ?? `Season ${season.seasonNumber}`,
                                      number: season.seasonNumber
                                    }));

        if(selectedSeason.value){
          fetchEpisodes(selectedSeason.value);
        }

        await tvStore.fetchTvShows();
        selectedMedia.value = tvStore.getTvShowById?.(mediaId) || null;

        try {
          selectedCast.value = await castStore.fetchCastByMediaId(mediaId, mediaType.value);
        }
        catch (error) {
          console.error("Could not fetch cast for ID:", mediaId, error);
        }

        try {
          selectedCrew.value = await crewStore.fetchCrewByMediaId(mediaId, mediaType.value);
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
      else if(mediaType.value === MediaTypes.Episode){
        seasonId.value = route.params.seasonID as string;
        episodeId.value = route.params.episodeID as string;

        await episodeStore.fetchEpisodesBySeasonId(Number(seasonId.value));
        selectedMedia.value = episodeStore.getEpisodeById?.(Number(seasonId.value), Number(episodeId.value)) || null;

        try {
          selectedCast.value = await castStore.fetchCastByMediaId(Number(episodeId.value), mediaType.value);
        }
        catch (error) {
          console.error("Could not fetch cast for ID:", mediaId, error);
        }

        try {
          selectedCrew.value = await crewStore.fetchCrewByMediaId(mediaId, mediaType.value);
        }
        catch (error) {
          console.error("Could not fetch crew for ID:", mediaId, error);
        }
      }




    });

    watch(seasonDropdown, (newValue) => {
      if(newValue.length && !selectedSeason.value){
        selectedSeason.value = newValue.find(season => season.number == 1)?.id || null;
      }
    });

    watch(selectedSeason, (newValue) => {
      if(newValue){
        fetchEpisodes(newValue);
      }
    });

    async function fetchEpisodes(seasonID:number) {
      const episodeArr = await episodeStore.fetchEpisodesBySeasonId(seasonID);
      episodes.value = episodeArr.sort((a, b) => a.episodeNumber - b.episodeNumber)
                          .map(episode => ({
                            id: episode.episodeID,
                            name: `${episode.episodeNumber}: ${episode.episodeName}`,
                            description: episode.overview ?? "",
                            stillPath: episode.stillPath ? `https://image.tmdb.org/t/p/w500${episode.stillPath}` : null
                          }))
    }
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

    const isTv = computed(() => mediaType.value === MediaTypes.Tv);

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
      showCrews,
      seasonDropdown,
      selectedSeason,
      mediaType,
      isTv,
      episodes,
      seasonId,
      episodeId
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

.episode-scroll-snap {
  height: 486px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-padding-top: 0;
  padding-right: 6px;
}

.snap-card {
  scroll-snap-align: start;
}

</style>
