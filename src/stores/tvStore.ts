import { ref } from "vue";
import type { Tv, TvStore } from "../types";

interface ApiTvShow {
  tvShowID: number;
  originalName: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  overview?: string | null;
  firstAirDate?: string | null;
  isInCollection?: boolean;
  collectionId: number | null;
}

export const useTvStore = (): TvStore => {
  const tvShows = ref<Tv[]>([]);
  const filterTvShows = ref<Tv[]>([]);
  const lastFetched = ref<number | null>(null);
  const CACHE_DURATION = 60 * 1000;


  //done
  const fetchFilterShows = async(
    force = false,
    query = '',
    searchTerm: number | null = null,
    minYear: number | null = null,
    maxYear: number | null = null,
    genre: (string | number)[] | null = null
  ): Promise<Tv[]> => {

    console.log(query, minYear, maxYear);

    const params = new URLSearchParams();

    if(query) params.append('query', query);
    if(searchTerm) params.append('searchTerm', String(searchTerm));
    if(minYear !== null) params.append('minYear', String(minYear));
    if(maxYear !== null) params.append('maxYear', String(maxYear));
    if (genre && genre.length > 0) {
      genre.map(String).forEach(g => params.append('filterGenre', g));
    }

    try{
      const response = await fetch(`/api/MediaDisplay/getShows?${params.toString()}`);
      if(!response.ok) throw new Error(`HTTP error!! Status: ${response.status}`);

      const jsonResponse = await response.json();
      console.log("Raw API Response: ", jsonResponse);

      if (!jsonResponse.data?.items || !Array.isArray(jsonResponse.data.items)) {
        throw new Error("Invalid API response format: Missing `data.items`");
      }

      filterTvShows.value = jsonResponse.data.items.map(
        (show: ApiTvShow, index): Tv => ({
          order: index,
          tvShowID: show.tvShowID,
          originalName: show.originalName,
          posterPath: show.posterPath ?? null,
          backdropPath: show.backdropPath ?? null,
          overview: show.overview ?? "No Overview Available",
          firstAirDate: show.firstAirDate ?? null,
          isInCollection: show.isInCollection ?? show.isIncollection ?? show.IsInCollection ?? false,
          collectionId: show.collectionId ?? (show as any).collectionID ?? null
        })
      );

      lastFetched.value = Date.now();
      console.log("Filtered Tv Shows successfully fetched: ", filterTvShows.value);

      return filterTvShows.value;
    }

    catch(error){
      console.error("Error fetching filtered Tv Shows", error);
      throw error;
    }
  };


  //done
  const fetchTvShows = async (force = false): Promise<Tv[]> =>{
    if(
      !force &&
      tvShows.value.length &&
      lastFetched.value &&
      Date.now() - lastFetched.value < CACHE_DURATION
    ){
      console.log("Using cached tv shown data");
      return tvShows.value;
    }

    try{
      const response = await fetch("/api/tvshow");
      if(!response.ok) throw new Error(`HTTP error!!  Status: ${response.status}`);

      const jsonResponse = await response.json();
      console.log("Raw API Response: ", jsonResponse);

      if(!jsonResponse.data?.items || !Array.isArray(jsonResponse.data.items)) {
        throw new Error("Invalid API response format: Missing `data.items`");
      }

      tvShows.value = jsonResponse.data.items.map((show: ApiTvShow) => ({
        tvShowID: show.tvShowID,
        originalName: show.originalName,
        posterPath: show.posterPath ?? null,
        backdropPath: show.backdropPath ?? null,
        overview: show.overview ?? "No Overview Available",
        firstAirDate: show.firstAirDate ?? null,
        isInCollection: show.isInCollection ?? show.isIncollection ?? show.IsInCollection ?? false,
        collectionId: show.collectionId ?? (show as any).collectionID ?? null
      }));

      lastFetched.value = Date.now();
      console.log("Tv Shows successfully fetched: ", tvShows.value);

      return tvShows.value;
    }

    catch(error) {
      console.error("Error fetching tv shows:", error);
      throw error;
    }
  };


  //done
  const getTvShowById = (id: string | number) => {
      return tvShows.value.find((show) => show.tvShowID == id) || null;
  };


  //done
  const getTvRecommendation = async (id: string | number) =>{
    try{
      const response = await fetch(`/api/tvshow/getTvRecommendation/${id}`);
      if(!response.ok) throw new Error(`HTTP error!!  Status: ${response.status}`);

      const jsonResponse = await response.json();
      console.log("Raw API Response: ", jsonResponse);

      if(!jsonResponse.data?.items || !Array.isArray(jsonResponse.data.items)) {
        throw new Error("Invalid API response format: Missing `data.items`");
      }

      tvShows.value = jsonResponse.data.items.map((show: ApiTvShow) => ({
        tvShowID: show.tvShowID,
        originalName: show.originalName,
        posterPath: show.posterPath ?? null,
        backdropPath: show.backdropPath ?? null,
        overview: show.overview ?? null,
        firstAirDate: show.firstAirDate ?? null
      }));

      lastFetched.value = Date.now();
      console.log("Tv Shows successfully fetched: ", tvShows.value);

      return tvShows.value;
    }

    catch(error) {
      console.error("Error fetching tv shows:", error);
      throw error;
    }
  };

  //done
  return {
    tvShows,
    filterTvShows,
    lastFetched,
    getTvShowById,
    fetchTvShows,
    fetchFilterShows,
    getTvRecommendation
  };
};
