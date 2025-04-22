import { ref } from "vue";
import type { Movie, MovieStore } from "../types";

interface ApiMovie {
  movieID?: string | number;
  tmdbid?: string | number;
  title: string;
  posterPath?: string | null;
  overview?: string | null;
  releaseDate?: string | null;
  runtime?: string | null;
  backdropPath?: string | null;
}

export const useMovieStore = (): MovieStore => {
  const filterMovies = ref<Movie[]>([]);
  const movies = ref<Movie[]>([]);
  const lastFetched = ref<number | null>(null);
  const CACHE_DURATION = 60 * 1000;

  const fetchFilterMovies = async (
    force = false,
    query = '',
    runtime: number | null = null,
    searchTerm: number | null = null,
    minYear: number | null = null,
    maxYear: number | null = null,
    genre: (string | number)[] | null = null // Allow numbers or strings
  ): Promise<Movie[]> => {
    console.log("Filter params:", { query, runtime, searchTerm, minYear, maxYear, genre });
  
    const params = new URLSearchParams();
  
    if (query) params.append('query', query);
    if (runtime !== null) params.append('runtime', String(runtime));
    if (searchTerm !== null) params.append('searchTerm', String(searchTerm));
    if (minYear !== null) params.append('minYear', String(minYear));
    if (maxYear !== null) params.append('maxYear', String(maxYear));
    if (genre && genre.length > 0) {
      genre.map(String).forEach(g => params.append('filterGenre', g));
    }
  
    console.log("Query Params:", params.toString());
  
    try {
      const response = await fetch(`/api/MediaDisplay/getMovies?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const jsonResponse = await response.json();
      console.log("Raw API Response:", jsonResponse);
  
      if (!jsonResponse.data?.items || !Array.isArray(jsonResponse.data.items)) {
        throw new Error("Invalid API response format: Missing `data.items`");
      }
  
      filterMovies.value = jsonResponse.data.items.map((movie: ApiMovie, index: number) => ({
        order: index,
        movieID: movie.movieID || movie.tmdbid || null,
        title: movie.title,
        posterPath: movie.posterPath ?? null,
        overview: movie.overview ?? null,
        releaseDate: movie.releaseDate ?? null,
        runtime: movie.runtime ?? null,
        backdropPath: movie.backdropPath ?? null,
      }));
  
      lastFetched.value = Date.now();
      console.log("Filtered Movies successfully fetched:", filterMovies.value);
      return filterMovies.value;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  };
  

  const fetchMovies = async (force = false): Promise<Movie[]> => {
    if (
      !force &&
      movies.value.length &&
      lastFetched.value &&
      Date.now() - lastFetched.value < CACHE_DURATION
    ) {
      console.log("Using cached movie data");
      return movies.value;
    }

    try {
      const response = await fetch("/api/movies");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const jsonResponse = await response.json();
      console.log("Raw API Response:", jsonResponse);

      if (!jsonResponse.data?.items || !Array.isArray(jsonResponse.data.items)) {
        throw new Error("Invalid API response format: Missing `data.items`");
      }

      movies.value = jsonResponse.data.items.map((movie: ApiMovie) => ({
        movieID: movie.movieID || movie.tmdbid || null,
        title: movie.title,
        posterPath: movie.posterPath ?? null,
        overview: movie.overview ?? null,
        releaseDate: movie.releaseDate ?? null,
        runtime: movie.runtime ?? null,
        backdropPath: movie.backdropPath ?? null,
      }));

      lastFetched.value = Date.now();
      console.log("Movies successfully fetched:", movies.value);
      return movies.value;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  };

  const getMovieById = (id: string | number) => {
    return movies.value.find((movie) => movie.movieID == id) || null;
  };

  const getMovieRecommendation = async (id: string | number) => {
    try {
      const response = await fetch(`/api/MediaDisplay/movie/${id}/recommendations`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const jsonResponse = await response.json();
      console.log("Raw API Response:", jsonResponse);

      if (!jsonResponse?.data?.items || !Array.isArray(jsonResponse.data.items)) {
        throw new Error("Invalid API response format: Missing `data.items`");
      }

      movies.value = jsonResponse.data.items.map((movie: ApiMovie) => ({
        movieID: movie.movieID || movie.tmdbid || null,
        title: movie.title ?? "Unknown Title",
        posterPath: movie.posterPath ?? null,
        overview: movie.overview ?? "No overview available.",
        releaseDate: movie.releaseDate ?? "Unknown release date",
        runtime: movie.runtime ?? "Unknown runtime",
        backdropPath: movie.backdropPath ?? null,
      }));

      console.log("Movies successfully fetched:", movies.value);
      return movies.value;
    } catch (error) {
      console.error("Error fetching movie recommendations:", error);
      throw error;
    }
  };
  


  return { 
    movies,
    filterMovies,  
    lastFetched,
    getMovieById,
    fetchMovies,  
    fetchFilterMovies,
    getMovieRecommendation
  };
};
