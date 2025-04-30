import { ref } from "vue";
import type { Episode, EpisodeStore } from "../types";

interface ApiEpisode{
  episodeID: number;
  episodeName: string;
  episodeNumber: number;
  overview?: string | null;
  runtime: number;
  seasonId: number;
  stillPath?: string | null;
  voteAverage: number;
  voteCount: number;
  airdate: string | null;
}

export const useEpisodeStore = (): EpisodeStore => {
  const episodes = ref<Record<number,Episode[]>>({});

  const fetchEpisodesBySeasonId = async (seasonID: number) => {
    if(!episodes.value[seasonID]){
      try{
        const response = await fetch(`/api/tvshow/episode/${seasonID}`);
        if(!response.ok) throw new Error(`HTTP error!! Status: ${response.status}`);

        const jsonResponse = await response.json();
        console.log("Raw API Response: ", jsonResponse);

        if(!jsonResponse.data?.items || !Array.isArray(jsonResponse.data.items)){
          throw new Error("Invalid API response format: Missing `data.items`");
        }

        episodes.value[seasonID] = jsonResponse.data.items.map((episode: ApiEpisode) => ({
          episodeID: episode.episodeID,
          episodeName: episode.episodeName,
          episodeNumber: episode.episodeNumber,
          overview: episode.overview ?? "No Overview Available",
          runtime: episode.runtime,
          seasonId: episode.seasonId,
          stillPath: episode.stillPath ?? null,
          voteAverage: episode.voteAverage,
          voteCount: episode.voteCount,
          airdate: episode.airdate ?? null
        }));

        console.log(`Episodes successfully fetched for Season Id ${seasonID}:  `, episodes.value[seasonID]);
        return episodes.value[seasonID];

      }

      catch(error){
        console.error(`Error fetching Episodes for  Season Id ${seasonID}:  `, error);
        throw error;
      }
    }

    return episodes.value[seasonID]
  };

  const getEpisodeById = async (seasonID: number, episodeID: number) => {
    const episodeArr = await fetchEpisodesBySeasonId(seasonID);
    return episodeArr.find(episode => episode.episodeID == episodeID) || null;
  };

  return{
    episodes,
    fetchEpisodesBySeasonId,
    getEpisodeById
  };
};
