import { ref } from "vue";
import type { Profile, ProfileStore } from "../types";

interface ApiProfile{
  id?: number | null;
  name: string;
  age: number;
  posterPath?: string | null;
}

export const useProfileStore = (): ProfileStore => {
  const profiles = ref<Profile[]>([]);

  let currentNumProfiles = 0;

  const pictureDict: Record<number, string> = {
    1: 'https://wallpapers.com/images/high/netflix-profile-pictures-1000-x-1000-dyrp6bw6adbulg5b.webp',
    2: 'https://wallpapers.com/images/high/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.webp',
    3: 'https://wallpapers.com/images/high/netflix-profile-pictures-1000-x-1000-vnl1thqrh02x7ra2.webp',
    4: 'https://wallpapers.com/images/high/netflix-profile-pictures-5yup5hd2i60x7ew3.webp',
    5: 'https://wallpapers.com/images/high/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.webp'
  };

  const createProfile = async (name: string, age: number): Promise<Profile> => {
    currentNumProfiles += 1;
    const newProfile: Profile = {
      id: currentNumProfiles,
      name: name,
      age: age,
      posterPath: pictureDict[currentNumProfiles] ?? null
    }

    profiles.value.push(newProfile);
    fetchProfiles();

    return newProfile;
  }

  const fetchProfiles = async (): Promise<Profile[]> => {
    return profiles.value;
  };

  return{
    profiles,
    createProfile,
    fetchProfiles,
    currentNumProfiles
  };
};
