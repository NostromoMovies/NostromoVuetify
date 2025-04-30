<template>
  <div class="container">
    <div v-if="loading" class="loading">
      Loading collection...
    </div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="content-wrapper">
      <div class="movie-grid">
        <MovieContainer 
          v-for="item in items"
          :key="item.tmdbMovieID || item.tmdbTvID"
          :to="`/${item.movieID ? 'movie' : 'tv'}/${item.movieID || item.tvShowID}`"
          :mediaId="item.movieID || item.tvShowID"
          :title="item.title"
          :posterPath="item.posterPath"
          :mediaType="item.movieID ? 'movie' : 'tv'"
          :collectionId="item.collectionId"
          :isInCollection="item.isInCollection"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MovieContainer from '@/components/collection/CollectionMovieContainer.vue';


defineOptions({
  name: 'CollectionView'
});

const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);
const items = ref<any[]>([]);

const fetchCollectionData = async () => {
  const collectionId = route.params.id;
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`/api/collection/${collectionId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('apikey')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch collection details');

    const data = await response.json();
    items.value = (data.items ?? []).map((item: any) => ({
      movieID: item.movieID || item.tmdbMovieID || null,
      tvShowID: item.tvShowID || item.tmdbTvID || null,
      title: item.title,
      posterPath: item.posterPath,
      mediaType: item.movieID ? 'movie' : 'tv',
      collectionId: item.collectionId,
      isInCollection: item.isInCollection
    }));

  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCollectionData);
</script>

<style scoped>
.container {
  padding-top: 80px;
  background-color: rgb(34, 34, 34);
  width: 100%;
  min-height: calc(100vh - 80px);
  right: 50%;
  top: 20%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-wrapper {
  width: 100%;
  right: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 160px));
  gap: 2rem;
  justify-content: center;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
}

.loading, 
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
  color: white;
  font-size: 1.2rem;
  text-align: center;
}
</style>