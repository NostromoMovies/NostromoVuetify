<template>
  <router-link :to="to" class="movie-card">
    <div class="poster-container">
      <img :src="image" alt="Poster" class="poster-image" @error="handleImageError" />
      <div class="overlay">
        <div class="movie-title">{{ title }}</div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  to: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true }
});

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://placehold.co/300x450?text=No+Poster'
}
</script>

<style scoped>
.movie-card {
  cursor: pointer;
  transition: transform 0.2s;
  width: 100%;
  /* max-width: 250px; */
  margin: 20;
}

.movie-card:hover {
  transform: scale(1.05);
}

.poster-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.poster-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.movie-card:hover .overlay {
  background: rgba(0, 0, 0, 0.6);
}

.movie-title {
  color: white;
  text-align: center;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 1rem;
  margin: 0;
  word-break: break-word;
}

.movie-card:hover .movie-title {
  opacity: 1;
}
</style>