<template>
  <div class="parent">
  <v-container class="container">
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="loading"
    ></v-progress-circular>
    
    <v-alert
      v-else-if="error"
      type="error"
      class="error"
    >
      {{ error }}
    </v-alert>
    
    <div v-else>
      <!-- Collection Header -->


      <!-- Collection Grid -->
      <v-row class="movie-grid">
        <v-col
          v-for="item in items"
          :key="item.tmdbMovieID || item.tmdbTvID"
          cols="6"
          sm="4"
          md="3"
          lg="2"
          xl="2"
        >
          <MovieContainer 
            :to="`/${item.movieID ? 'movie' : 'tv'}/${item.movieID || item.tvShowID}`"
            :mediaId="item.movieID || item.tvShowID"
            :title="item.title"
            :posterPath="item.posterPath"
            :mediaType="item.movieID ? 'movie' : 'tv'"
            :collectionId="item.collectionId"
            :isInCollection="item.isInCollection"
            @removed="handleItemRemoved"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
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

// Handle when an item is removed
const handleItemRemoved = () => {
  fetchCollectionData(); // Refresh the collection data
};

onMounted(fetchCollectionData);
</script>


<style scoped>

.parent {
  display: block;
  width: 100%;
  min-height: 100vh;
  background-color: #121212;
  padding: 50px 0;
}

.container {
  background-color: #1E1E1E;
  padding-top: 20px;
  padding-left: 16px;
  padding-right: 16px;
}

.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error {
  margin-top: 40px;
}

.movie-grid {
  margin-top: 20px;
  row-gap: 20px;
}




</style>