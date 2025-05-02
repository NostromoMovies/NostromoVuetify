<template>
  <v-container>
    <v-card class="unrecognized-card" @click="navigateToTvMatching">
      <v-card-title>Unrecognized TV Episodes</v-card-title>
      <v-card-text>
        <div v-if="tvs.length > 0" class="movies-container">
          <p>{{ tvs.length }} unrecognized TV files found.</p>
        </div>
        <div v-else class="no-movies">No unrecognized TV files found</div>
      </v-card-text>
    </v-card>

    <!-- Notification for unrecognized shows -->
    <v-snackbar v-model="showUnrecognizedNotification" color="warning" :timeout="3000" location="top">
      <v-icon start>mdi-alert</v-icon>
      {{ tvs.length }} new unrecognized TV files found!
      <template v-slot:actions>
        <v-btn variant="text" @click="showUnrecognizedNotification = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useNavigationStore } from '@/stores/useNavigationStore';

const navigationStore = useNavigationStore();
const tvs = ref([]);
const showUnrecognizedNotification = ref(false);
const previousCount = ref(0);

const fetchUnrecognizedTv = async () => {
  try {
    const response = await axios.get('http://localhost:8112/api/MediaDisplay/unrecognized-tv');
    if (Array.isArray(response.data)) {
      const newCount = response.data.length;

      if (newCount > previousCount.value) {
        showUnrecognizedNotification.value = true;
      }

      previousCount.value = newCount;
      tvs.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching unrecognized TV files:', error);
  }
};

const navigateToTvMatching = () => {
  navigationStore.navigateToUnrecognizedTv();
};

onMounted(() => {
  fetchUnrecognizedTv();
  setInterval(fetchUnrecognizedTv, 60000); // Poll every 60 seconds
});

watch(tvs, (newVal, oldVal) => {
  if (newVal.length < oldVal.length) {
    showUnrecognizedNotification.value = true;
  }
}, { deep: true });</script>

<style scoped>
  .unrecognized-card {
    background-color: rgb(34, 34, 34);
    color: white !important;
    box-shadow: none !important;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

    .unrecognized-card:hover {
      background-color: rgb(24, 24, 24);
    }

  .movies-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .no-movies {
    text-align: center;
    padding: 20px;
    color: #666;
  }
</style>
