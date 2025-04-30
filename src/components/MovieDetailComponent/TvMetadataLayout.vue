<template>
  <div class="background-container" :style="backgroundStyle">
    <div class="overlay"></div>
    <div class="movie-title-box">
      <h1>{{selectedMedia?.originalName || selectedMedia?.episodeName|| "Loading..." }}</h1>
    </div>

    <v-container class="custom-container" fluid>
      <v-row>
        <v-col cols="12" md="4">
          <v-card outlined class="movie-poster">
            <v-img v-if="selectedMedia?.posterPath || selectedMedia?.stillPath"
                   :src="`https://image.tmdb.org/t/p/w500${selectedMedia.posterPath ?? selectedMedia.stillPath}`"
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

      <v-select v-if="isTv"
                v-model="selectedSeason"
                :items="seasonDropdown"
                item-title="name"
                item-value="id"
                label="Select a Season"
                outlined
                dense
                class="w-33 mt-4" />

      <v-container class="episode-container" fluid
                   v-if="isTv">
        <v-row>
          <v-col cols="12" md="12" lg="12" class="mt-4">
            <v-card outlined class="Episode-card pa-4 rounded-lg"
                    style="height: 513px; background-color: rgb(34,34,34);">
              <div :class="episodes.length > 3 ? 'episode-scroll-snap' : 'episode-no-scroll'">
                <v-card v-for="episode in episodes"
                        :key="episode.id"
                        :to="`/season/${selectedSeason}/episode/${episode.id}`"
                        outlined class="Episode-card pa-2 d-flex align-start rounded-lg mb-4 snap-card"
                        style="height: 150px; background-color: #4f4f4f;">

                  <v-img :src="episode.stillPath"
                         height=160px
                         max-width=200px
                         min-width=200px
                         class="mr-4 rounded"
                         cover />

                  <v-col class="flex-grow-1 pa-0 text-left" style="min-width: 0;">
                    <v-card-title class="text-white text-h6 font-weight-bold py-1">
                      {{episode.name}}
                    </v-card-title>

                    <v-card-subtitle class="text-white text-caption py-0"
                                     style="height: 7em; overflow: hidden; text-overflow: ellipsis; white-space: normal; display: block;">
                      <div>{{ episode.description }}</div>
                      <div v-if="episode.runtime" style="font-size: 0.75rem; opacity: 0.7;">
                        {{ episode.runtime }}m
                      </div>
                    </v-card-subtitle>
                  </v-col>

                  <v-col class="shrink mt-auto mb-auto d-flex justify-end" cols="auto">
                    <v-btn icon
                           variant="elevated"
                           @click.prevent="playEpisodeVideo(episode.id)">
                      <v-icon>mdi-play</v-icon>
                    </v-btn>
                  </v-col>
                </v-card>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
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
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useMovieStore } from "@/stores/movieStore";
import { useTvCastStore } from "@/stores/tvCastStore";
import { useTvCrewStore } from "@/stores/tvCrewStore";
import { useTvStore } from "@/stores/tvStore";
import { useSeasonStore } from "@/stores/seasonStore";
import { useEpisodeStore } from "@/stores/episodeStore";
import { MediaTypes } from "@/enums/MediaTypeEnum";
import { getService } from '@/api/GetService';
import { ro } from "vuetify/locale";

export default {
  setup() {
    const route = useRoute();
    const mediaType = ref("");
    const seasonId = ref("");
    const episodeId = ref("");
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

    watch(episodes, newEpisodes => {
      if (
        mediaType.value === MediaTypes.Tv &&
        newEpisodes.length &&
        selectedMedia.value &&
        selectedMedia.value.runtime == null
      ) {
        const runtime = Number(newEpisodes[0].runtime) || 0;
        if (runtime > 0) {
          selectedMedia.value = { ...selectedMedia.value, runtime };
        }
      }
    });

    onMounted(async () => {
      mediaType.value = route.params.episodeID ? MediaTypes.Episode : MediaTypes.Tv;


      if (mediaType.value === MediaTypes.Tv) {
        const mediaId = Number(route.params.id);
        await tvStore.fetchTvShows();
        selectedMedia.value = tvStore.getTvShowById(mediaId) || null;

        const seasons = await seasonStore.fetchSeasonsByTvShowId(mediaId);
        seasonDropdown.value = seasons
          .sort((a, b) => a.seasonNumber - b.seasonNumber)
          .map(s => ({
            id: s.seasonID,
            name: s.seasonName ?? `Season ${s.seasonNumber}`,
            number: s.seasonNumber
          }));

        if (selectedMedia.value && seasons.length) {
          const eps = await episodeStore.fetchEpisodesBySeasonId(seasons[0].seasonID);

          const rawRuntime = eps[0]?.runtime;
          const runtime = Number(rawRuntime);

          console.log("episode runtime:", rawRuntime);

          if (runtime > 0) {
            selectedMedia.value = { ...selectedMedia.value, runtime };
          }
        }

        if (selectedSeason.value) fetchEpisodes(selectedSeason.value);

        try { selectedCast.value = await castStore.fetchCastByMediaId(mediaId, mediaType.value); } catch { }
        try { selectedCrew.value = await crewStore.fetchCrewByMediaId(mediaId, mediaType.value); } catch { }
        try { await tvStore.getTvRecommendation(mediaId); } catch { }
      }

      else if (mediaType.value === MediaTypes.Episode){
        seasonId.value = route.params.seasonID as string;
        episodeId.value = route.params.episodeID as string;
        //console.log(`Season: ${seasonId.value}    Episode: ${episodeId.value}`)
        await episodeStore.fetchEpisodesBySeasonId(Number(seasonId.value));
        selectedMedia.value = await episodeStore.getEpisodeById(Number(seasonId.value), Number(episodeId.value));

        try { selectedCast.value = await castStore.fetchCastByMediaId(Number(episodeId.value), mediaType.value); } catch { }
        try { selectedCrew.value = await crewStore.fetchCrewByMediaId(Number(episodeId.value), mediaType.value); } catch { }
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
                            runtime: episode.runtime,
                            stillPath: episode.stillPath ? `https://image.tmdb.org/t/p/w500${episode.stillPath}` : null,
                            airdate: episode.airdate ?? null
                          }))
      console.log("SelectedMedia:", selectedMedia.value);
    }
    const metadataBoxes = computed(() => {
      if (!selectedMedia.value) return "Loading details...";

      const media = selectedMedia.value;
      const isEpisode = media.episodeID !== undefined;

      const runtimeMinutes = Number(media.runtime);
      let runtimeString = "Unknown";

      if (runtimeMinutes > 0) {
        if (runtimeMinutes >= 60) {
          const hours = Math.floor(runtimeMinutes / 60);
          const minutes = runtimeMinutes % 60;
          runtimeString = `${hours}h ${minutes}m`;
        } else {
          runtimeString = `${runtimeMinutes}m`;
        }
      }

      const overview = media.overview ?? "N/A";

      let firstAirYear = "Unknown";
      if (episodes.value.length > 0 && episodes.value[0].airdate) {
        const airDate = new Date(episodes.value[0].airdate);
        if (!isNaN(airDate.getTime())) {
          firstAirYear = airDate.getFullYear().toString();
        }
      }

      return `
    <strong style="font-size: 20px; display: block; margin-bottom: 5px;">Overview:</strong>
    ${overview} <br><br>

    <strong style="font-size: 20px; display: block; margin-bottom: 5px;">Release Year:</strong>
    ${firstAirYear} <br><br>

    <strong style="font-size: 20px; display: block; margin-bottom: 5px;">Runtime:</strong>
    ${runtimeString}
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


    // Inside setup()
    async function playEpisodeVideo(episodeId: number) {
      try {
        // Ensure episodeId is a valid number
        if (typeof episodeId !== 'number' || isNaN(episodeId)) {
          throw new Error("Invalid Episode ID");
        }
        console.log("Requesting video for EPISODE ID:", episodeId);

        // !!! CRITICAL STEP !!!
        // Replace getService.getVideoID with the CORRECT function
        // that gets a video/stream ID from an EPISODE ID from your backend.
        // Example (replace with your actual function if different):
        const response = await getService.getVideoID(Number(episodeId));
        // --- END CRITICAL STEP ---

        // Add logging to see what the backend returns
        console.log("Raw video ID response:", response);
        const videoId = response?.data; // Safely access data
        console.log("Extracted videoId:", videoId);

        // Adjust validation based on expected valid IDs from backend
        if (videoId === null || videoId === undefined || videoId < 0) { // Made check slightly more robust
          throw new Error("Invalid or missing video ID received from service");
        }
        console.log(`Received Video ID ${videoId} for Episode ID ${episodeId}`);

        // Create iframe, use it to launch the protocol handler, then remove it
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.src = `nostromoshim://play/${videoId}`;
        console.log(`Launching protocol: ${iframe.src}`);

        // Remove the iframe after a short delay
        setTimeout(() => {
          if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
          }
        }, 500);

      } catch (err) {
        console.error(`Failed to play video for episode ${episodeId}:`, err);
        // Optionally: Show an error message to the user
      }
    }

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
      episodeId,
      playEpisodeVideo
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

  .text-center {
    word-wrap: break-word;
  }

  .title-row {
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
