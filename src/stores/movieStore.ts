import { ref } from "vue";
import type { Movie, MovieStore } from "../types";

// Define the structure of the API response
interface ApiMovie {
  movieID?: string | number;
  tmdbid?: string | number;
  title: string;
  posterPath?: string | null;
}

export const useMovieStore = (): MovieStore => {
  const movies = ref<Movie[]>([]);
  const lastFetched = ref<number | null>(null);
  const CACHE_DURATION = 60 * 1000;

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

      // Explicitly type the `movie` parameter
      movies.value = jsonResponse.data.items.map((movie: ApiMovie) => ({
        movieID: movie.movieID || movie.tmdbid || null,
        title: movie.title,
        posterPath: movie.posterPath ?? null,
      }));

      lastFetched.value = Date.now();
      console.log("Movies successfully fetched:", movies.value);

      return movies.value;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  };

  return { movies, fetchMovies, lastFetched };
};