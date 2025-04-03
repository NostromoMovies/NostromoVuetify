import { ref } from "vue";
import type { TvShow, TvShowStore } from "../types";

interface ApiTvShow{
  showID: number;
  name: string;
  posterPath?: string | null;
  overview?: string | null;
  backdropPath?: string | null;
  voteAverage: number;
  voteCount: number
}

export const useTvShowStore = (): TvShowStore => {
  const shows = ref<TvShow[]>([]);
  const lastFetched =  ref<number | null>(null);
  const CACHE_DURATION = 60*1000;

  const fetchTvShows = async (force = false): Promise<TvShow[]> => {
    if(!force && shows.value.length &&
      lastFetched.value && Date.now() - lastFetched.value < CACHE_DURATION){
        console.log("Using cached TvShow data");
        return shows.value;
      }

      try{
        const response = await fetch("api/shows")
        if(!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const jsonResponse = await response.json();
        console.log("Raw API Response: ", jsonResponse);

        if(!jsonResponse.data?.items || Array.isArray(jsonResponse.data.items)){
          throw new Error("Invalid API response format: Missing `data.items`");
        }

        shows.value = jsonResponse.data.items.map((show: ApiTvShow) => ({
          showID: show.showID,
          name: show.name,
          posterPath: show.posterPath ?? null,
          overview: show.overview ?? null,
          backdropPath: show.backdropPath ?? null,
          voteAverage: show.voteAverage,
          voteCount: show.voteCount
        }));
        lastFetched.value = Date.now();
        console.log("TVShows successfully fetched:", shows.value);
        return shows.value;
      }
      catch(error){
        console.error("Error fetching TvShows: ", error);
        throw error;
      }
  };

  const getTvShowById = (id: number) => {
    return shows.value.find((show) => show.showID == id) || null;
  }
}
