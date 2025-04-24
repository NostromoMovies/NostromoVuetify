import { ref } from "vue";
import type { TvCrewMember } from "../types";

interface ApiTvCrewMember {
  adult?: boolean | null;
  gender?: number | null;
  id?: number | null;
  known_for_department?: string | null;
  name?: string | null;
  original_name?: string | null;
  popularity?: number | null;
  profile_path?: string | null;
  credit_id?: string | null;
  department?: string | null;
  job?: string | null;
}

export const useTvCrewStore = () => {
  const crew = ref<TvCrewMember[]>([]);
  const lastFetched = ref<number | null>(null);
  const CACHE_DURATION = 60 * 1000;

  const fetchCrewByMediaId = async (mediaID: string | number, mediaType: string, force = false): Promise<TvCrewMember[]> => {
    if (
      !force &&
      crew.value.length &&
      lastFetched.value &&
      Date.now() - lastFetched.value < CACHE_DURATION
    ) {
      console.log("Using cached crew data");
      return crew.value;
    }

    try {
      const response = await fetch(`/api/Credits/${mediaType}/crew/${mediaID}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log("Raw API Crew Response:", jsonResponse);

      if (!jsonResponse.data?.items || !Array.isArray(jsonResponse.data.items)) {
        throw new Error("Invalid API response format: Missing `data.items`");
      }

      crew.value = jsonResponse.data.items.map((member: ApiTvCrewMember) => ({
        id: member.id ?? null,
        name: member.name ?? null,
        originalName: member.original_name ?? null,
        creditId: member.credit_id ?? null,
        gender: member.gender ?? null,
        knownForDepartment: member.known_for_department ?? null,
        popularity: member.popularity ?? null,
        profilePath: member.profile_path ?? null,
        adult: member.adult ?? null,
        department: member.department ?? null,
        job: member.job ?? null,
      }));

      lastFetched.value = Date.now();
      console.log("Crew successfully fetched:", crew.value);
      return crew.value;
    } catch (error) {
      console.error("Error fetching crew:", error);
      throw error;
    }
  };

  const getCrewByMediaId = (mediaID: string | number) => {
    return crew.value.length ? crew.value : null;
  };

  return {
    crew,
    fetchCrewByMediaId,
    lastFetched,
    getCrewByMediaId
  };
};
