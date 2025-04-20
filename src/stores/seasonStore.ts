import { ref } from "vue";
import type { Season, SeasonStore } from "../types";

interface ApiSeason{
  seasonID: number;
  tvShowID: number;
  seasonNumber: number;
  overview?: string | null;
  posterPath?: string | null;
  episodeCount?: number | 0;
  seasonName?: string | null;
}

export const useSeasonStore = (): SeasonStore => {
  const seasons = ref<Record<number,Season[]>>({});

  const fetchSeasonsByTvShowId = async (tvShowID: number) => {
    if(!seasons.value[tvShowID]){
      try{
        const response = await fetch(`/api/tvshow/season/${tvShowID}`);
        if(!response.ok) throw new Error(`HTTP error!! Status: ${response.status}`);

        const jsonResponse = await response.json();
        console.log("Raw API Response: ", jsonResponse);

        if(!jsonResponse.data?.items || !Array.isArray(jsonResponse.data.items)){
          throw new Error("Invalid API response format: Missing `data.items`");
        }

        seasons.value[tvShowID] = jsonResponse.data.items.map((season: ApiSeason) => ({
          seasonID: season.seasonID,
          tvShowID: season.tvShowID,
          seasonNumber: season.seasonNumber,
          overview: season.overview ?? "No Overview Available",
          posterPath: season.posterPath ?? null,
          episodeCount: season.episodeCount,
          seasonName: season.seasonName ?? null
        }));

        console.log(`Seasons successfully fetched for TvShow Id ${tvShowID}:  `, seasons.value[tvShowID])

        return seasons.value[tvShowID];
      }

      catch(error){
        console.error(`Error fetching Seasons for  TvShow Id ${tvShowID}:  `, error);
        throw error;
      }
    }
    return seasons.value[tvShowID];
  };

  const getSeasonByShowAndNum = async (tvShowID: number, seasonNumber: number) => {
    const seasonArr = await fetchSeasonsByTvShowId(tvShowID);
    return seasonArr.find(season => season.seasonNumber == seasonNumber) || null;
  };


  return{
    seasons,
    fetchSeasonsByTvShowId,
    getSeasonByShowAndNum,
  };
};
