<template>
  <router-link :to="to" class="movie-card">
    <div class="poster-container">
      <img :src="posterImage" alt="Poster" class="poster-image" @error="handleImageError" />
      <div class="overlay">
        <div class="movie-title">{{ title }}</div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
  import { defineProps, ref, onMounted } from 'vue';
  import { getService } from '@/api/getService';

  const props = defineProps({
    to: { type: String, required: true },
    movieId: { type: Number, required: true },
    title: { type: String, required: true }
  });

  const posterImage = ref(`/api/movies/${props.movieId}/poster`);

  const fetchPoster = async () => {
    try {
      const response = await fetch(posterImage.value, { method: 'HEAD' });

      if (!response.ok) {
        await getService.getPoster(props.movieId);
        setTimeout(() => {
          posterImage.value = `/api/movies/${props.movieId}/poster?reload=${Date.now()}`;
        }, 2000);
      }
    } catch {
      posterImage.value = 'https://placehold.co/300x450?text=No+Poster';
    }
  };

  const handleImageError = (e: Event) => {
    (e.target as HTMLImageElement).src = 'https://placehold.co/300x450?text=No+Poster';
  };

  onMounted(fetchPoster);
</script>

<style scoped>
  .poster-container {
    position: relative;
    width: 100%;
    padding-top: 150%;
    overflow: hidden;
  }

  .poster-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
