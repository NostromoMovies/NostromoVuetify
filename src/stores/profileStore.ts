import { ref } from "vue";
import type { Profile, ProfileStore } from "../types";
import { da } from "vuetify/locale";

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

    const response = await fetch('/api/profiles/create', {
      method: 'POST',
      headers: {
         'Authorization': `Bearer ${localStorage.getItem('apikey')}`,
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        age,
        posterPath: pictureDict[profiles.value.length + 1] ?? null
      })
    });

    if (!response.ok){
      currentNumProfiles -= 1;
      throw new Error("Failed to create profile");
    }

    const { profileId} = await response.json();

    const newProfile: Profile = {
      id: profileId,
      name,
      age,
      posterPath: pictureDict[currentNumProfiles]
    };

    profiles.value.push(newProfile);
    fetchProfiles();
    return newProfile;
  }

  const fetchProfiles = async (): Promise<Profile[]> => {
    const response = await fetch('/api/profiles/all', {
      method: 'GET',
      headers: {
         'Authorization': `Bearer ${localStorage.getItem('apikey')}`,
         'Content-Type': 'application/json'
      }
    });

    if(!response.ok) throw new Error("Failed to fetch profiles");

    const data: ApiProfile[] = await response.json();

      const mappedProfiles: Profile[] = data.map(p => ({
        id: p.id ?? null,
        name: p.name,
        age: p.age,
        posterPath: p.posterPath ?? null
      }));

      profiles.value = mappedProfiles;

      return mappedProfiles;
  };

  const selectProfile = async (profileId: number): Promise<void> => {
    const response = await fetch(`/api/profiles/selectedProfile/${profileId}`, {
      method: 'POST',
      headers: {
         'Authorization': `Bearer ${localStorage.getItem('apikey')}`,
         'Content-Type': 'application/json'
      }
    });

    if (!response.ok){
      throw new Error("Failed to select profile");
    }

    const data = await response.json();

    console.log("Selected Profile: ", data);
  }

  const deleteProfile = async (profileId: number): Promise<void> => {
    console.log("ProfilId is: ", profileId);
    const response = await fetch(`/api/profiles/delete/${profileId}`, {
      method: 'DELETE',
      headers: {
         'Authorization': `Bearer ${localStorage.getItem('apikey')}`,
         'Content-Type': 'application/json'
      }
    });

    if(!response.ok){
      throw new Error("Failed to delete profile");
    }

    profiles.value = profiles.value.filter(p => p.id !== profileId);
    fetchProfiles();
  }

  const updateProfile = async (profileId: number, name: string, age: number): Promise<boolean> => {
    const updatedProfile = profiles.value.find(p => p.id === profileId);
    const response = await fetch('/api/profiles/update', {
      method: 'POST',
      headers: {
         'Authorization': `Bearer ${localStorage.getItem('apikey')}`,
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profileID: profileId,
        name,
        age,
        posterPath: updatedProfile.posterPath
      })
    });

    if(!response.ok){
      throw new Error("Failed to update profile");
      return false;
    }



    if(updatedProfile){
      updatedProfile.name = name;
      updatedProfile.age = age
    }

    return true;
  }

  return{
    profiles,
    createProfile,
    fetchProfiles,
    selectProfile,
    deleteProfile,
    updateProfile,
    currentNumProfiles
  };
};
