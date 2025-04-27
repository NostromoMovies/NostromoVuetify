<template>
  <div class="container">
    <div v-if="loading" class="loading">
    Loading collection...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="movie-grid">
        <MovieContainer v-for="item in items"
                        :key="item.movieID"
                        :to="`/movie/${item.movieID}`"
                        :mediaId="item.movieID"
                        :title="item.title"
                        :posterPath="item.posterPath"
                        mediaType="movie" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MovieContainer from '@/components/collection/CollectionMovieContainer.vue';

const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);
const items = ref<any[]>([]);

onMounted(async () => {
  const collectionId = route.params.id;

  try {
    const response = await fetch(`/api/collection/${collectionId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('apikey')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch collection details');

    const data = await response.json();
    items.value = data.items ?? [];
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
});</script>

<style scoped>
  .container {
    padding-top: 80px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: rgb(34, 34, 34);
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 2rem;
    justify-items: center;
    margin-top: 20px;
  }
</style>
