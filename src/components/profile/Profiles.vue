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

                  <v-avatar size="100" rounded="0">
                    <v-img :src="profile.posterPath ?? 'https://wallpapers.com/images/high/netflix-profile-pictures-1000-x-1000-dyrp6bw6adbulg5b.webp'" alt="Profile Avatar"/>
                  </v-avatar>
                  <v-card-title>{{ profile.name }}</v-card-title>
                  <v-card-subtitle>Age: {{ profile.age }}</v-card-subtitle>
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useProfileStore } from '@/stores/profileStore';

const router = useRouter();
const profileStore = useProfileStore();

const dialog = ref(false);
const newProfileName = ref('');
const newProfileAge = ref<number | null>(null);
const showSnackbar =ref(false)
const profiles = ref<{id?: number | null; name: string; age: number; posterPath?: string | null}[]>([]);

onMounted(async () => {
  async function fetchProfiles(){
    const profileArr = await profileStore.fetchProfiles();

    profiles.value = profileArr.map(profile => ({
      id: profile.id,
      name: profile.name,
      age: profile.age,
      posterPath: profile.posterPath
    }))
  };

  fetchProfiles();
});

const submitProfile = async () => {
  if (!newProfileName.value || !newProfileAge.value) {
    alert('Please enter your name and age.');
    return
  }

  const profile = await profileStore.createProfile(newProfileName.value, newProfileAge.value);

  profiles.value.push(profile);

  newProfileAge.value = null;
  newProfileName.value = '';

  dialog.value = false;
  showSnackbar.value = true
}
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
