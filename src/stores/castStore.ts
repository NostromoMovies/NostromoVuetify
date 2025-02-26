import { ref } from "vue";
import type { CastMember } from "../types";

interface ApiCastMember {
  adult?: boolean | null;
  gender?: number | null;
  id?: number | null;
  known_for_department?: string | null;
  name?: string | null;
  original_name?: string | null;
  popularity?: number | null;
  profile_path?: string | null;
  cast_id?: number | null;
  character?: string | null;
  credit_id?: string | null;
  order?: number | null;
}

export const useCastStore = () => {
  const cast = ref<CastMember[]>([]);
  const lastFetched = ref<number | null>(null);
  const CACHE_DURATION = 60 * 1000;

  const fetchCastByMovieId = async (movieID: string | number, force = false): Promise<CastMember[]> => {
    if (
      !force &&
      cast.value.length &&
      lastFetched.value &&
      Date.now() - lastFetched.value < CACHE_DURATION
    ) {
      console.log("Using cached credits data");
      return cast.value;
    }

    try {
      const response = await fetch(`/api/Credits/cast/${movieID}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log("Raw API Credits Response:", jsonResponse);

      if (!jsonResponse.data?.items || !Array.isArray(jsonResponse.data.items)) {
        throw new Error("Invalid API response format: Missing `data.items`");
      }

      cast.value = jsonResponse.data.items.map((member: ApiCastMember) => ({
        id: member.id ?? null,
        name: member.name ?? null,
        originalName: member.original_name ?? null,
        character: member.character ?? null,
        creditId: member.credit_id ?? null,
        gender: member.gender ?? null,
        knownForDepartment: member.known_for_department ?? null,
        order: member.order ?? null,
        popularity: member.popularity ?? null,
        profilePath: member.profile_path ?? null,
        adult: member.adult ?? null,
      }));

      lastFetched.value = Date.now();
      console.log("Credits successfully fetched:", cast.value);
      return cast.value;
    } catch (error) {
      console.error("Error fetching credits:", error);
      throw error;
    }
  };

  const getCastByMovieId = (movieID: string | number) => {
    return cast.value.length ? cast.value : null;
  };

  return { 
    cast, 
    fetchCastByMovieId, 
    lastFetched,
    getCastByMovieId
  };
};
