<template>
  <v-container class="Profile-container" fluid>
    <v-row class="justify-center align-center fill-height">
      <v-col cols="12" class="mt-4">
        <v-card outlined class="pa-8 rounded-lg"
          style="height: 500px; width: 95%; max-width: 1400px; margin: auto; background-color: rgb(34,34,34);">

            <v-row justify="center">
              <v-col
                v-for="(profile, index) in profiles"
                :key="profile.id ?? index"
                cols="12" sm="6" md="4" lg="3"
              >
                <v-card outlined class="pa-2 text-center" color="#4f4f4f">

                  <v-avatar size="100" rounded="0" @click="selectProfile(Number(profile.id))">
                    <v-img :src="profile.posterPath ?? 'https://wallpapers.com/images/high/netflix-profile-pictures-1000-x-1000-dyrp6bw6adbulg5b.webp'" alt="Profile Avatar"/>
                  </v-avatar>
                  <v-card-title>{{ profile.name }}</v-card-title>
                  <v-card-actions class="justify-center">
                    <v-btn color="primary" variant="text" @click="editProfile(profile)">
                      <v-icon start>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn color="error" variant="text" @click="confirmDelete(Number(profile.id))">
                      <v-icon start>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>

                </v-card>
              </v-col>
              <v-col cols="12" class="text-center" v-if="profiles.length < 5">
                <v-btn icon variant="elevated"  @click="dialog = true" style="margin-top: 150px;">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>



            <v-dialog v-model="dialog" max-width="500px">
              <v-card class="pa-6">
                <v-card-title>
                  Create New Profile
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="newProfileName" label="Name" required/>
                  <v-text-field v-model="newProfileAge" label="Age" required/>
                </v-card-text>

                <v-card-actions class="justify-end">
                  <v-btn-text @click="dialog = false">Cancel</v-btn-text>
                  <v-btn color="primary" @click="submitProfile">Create</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-snackbar v-model="showSnackbar" timeout="2000" color="success">
              Profile Successfully Created!
            </v-snackbar>

            <v-snackbar v-model="deleteSnackbar" timeout="2000" color="success">
              Profile Successfully Deleted!
            </v-snackbar>

            <v-snackbar v-model="editSnackbar" timeout="2000" color="success">
              Profile Successfully Edited!
            </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { useProfileStore } from '@/stores/profileStore';
  import type { Profile } from '@/types';

  const router = useRouter();
  const profileStore = useProfileStore();
  const profiles = ref<Profile[]>([]);
  const dialog = ref(false);
  const newProfileName = ref('');
  const newProfileAge = ref<number | null>(null);
  const showSnackbar = ref(false);
  const deleteSnackbar = ref(false);
  const editSnackbar = ref(false)
  const editingProfileId = ref<number | null>(null);

  onMounted(async () => {
    try{
      profiles.value = await profileStore.fetchProfiles();
    }
    catch (error){
      console.error('Failed to fetch profiles.', error);
    }
  });

  const submitProfile = async () => {
    if (!newProfileName.value || !newProfileAge.value) {
      alert('Please enter your name and age.');
      return
    }
    try{

      if(editingProfileId.value !== null){
        await profileStore.updateProfile(editingProfileId.value, newProfileName.value, newProfileAge.value);
        editSnackbar.value = true;
      }
      else{
        await profileStore.createProfile(newProfileName.value, newProfileAge.value);
        showSnackbar.value = true;
      }


      newProfileAge.value = null;
      newProfileName.value = '';

      dialog.value = false;

      editingProfileId.value = null;
    }
    catch (error){
      console.error('Failed to create profile:', error);
      alert('Failed to create profile.');
    }
  }

  const selectProfile = async (profileId: number) => {
    try {
      await profileStore.selectProfile(profileId);
      router.push('/dashboard');
    }
    catch (error){
      console.error('Failed to select profile:', error);
    }
  };

  const editProfile = async (profile: Profile) => {
    newProfileName.value = profile.name;
    newProfileAge.value = profile.age;
    editingProfileId.value = profile.id!;
    dialog.value = true
  }

  const confirmDelete = async (profileId: number) => {
    const confirmed = confirm('Are you sure you want to delete this profile?');
    if (!confirmed) return;

    try {
      await profileStore.deleteProfile(profileId);
      deleteSnackbar.value = true;
    }
    catch (error) {
      console.error('Failed to delete profile:', error);
      alert('Delete failed.');
    }
  };
</script>

<style scoped>
  .Profile-container {
    height: 100vh;
    margin-left: 50%;
    margin-right: 20%;
    align-content: center;
    overflow: hidden;
  }
</style>
