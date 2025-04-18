<template>
  <div class="movie-card">
    <router-link :to="to" class="poster-link">
      <div class="poster-container">
        <img :src="posterImage" alt="Poster" class="poster-image" @error="handleImageError" />
        <div class="overlay">
          <div class="movie-title">{{ title }}</div>
        </div>
      </div>
    </router-link>
    <div class="button-stack">
      <button class="action-button play">▶ Play</button>
      <button class="action-button add">＋ Add</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, ref, onMounted } from 'vue';
  import { getService } from '@/api/GetService';

  const props = defineProps({
    to: { type: String, required: true },
    movieId: { type: Number, required: true },
    title: { type: String, required: true }
  });

  const posterImage = ref(`/api/movies/${props.movieId}/poster`);

  const fetchPoster = async () => {
    try {
      console.log("Ran")
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
  .movie-card {
    display: flex;
    flex-direction: column;
  }

  .poster-link {
    display: block;
    text-decoration: none;
  }

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

  .button-stack {
    display: flex;
    flex-direction: column;
    margin: 10px;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .action-button {
    width: 100%;
    background-color: #1f1f1f;
    color: white;
    border: none;
    padding: 0.75rem 0;
    font-size: 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .action-button:hover {
    background-color: #333;
  }
</style>