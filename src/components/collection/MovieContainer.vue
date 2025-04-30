<template>
  <div class="movie-card">
    <router-link :to="to" class="poster-link">
      <div class="poster-container">
        <img :src="posterImage" alt="Poster" class="poster-image" @error="handleImageError" />
        <div class="overlay"></div>
        <div v-if="mediaType === 'collection'" class="collection-badge">C</div>
      </div>
    </router-link>

    <div class="button-stack">
      <v-btn color="primary"
             variant="flat"
             block
             class="action-button"
             prepend-icon="mdi-play"
             :disabled="mediaType === 'collection'"
             @click="playVideo">
        Play
      </v-btn>

      <v-menu v-if="!props.isInCollection" dark>
  <template #activator="{ props: menuProps }">
    <v-btn v-bind="menuProps"
           color="secondary"
           variant="outlined"
           block
           class="action-button"
           prepend-icon="mdi-plus"
           :disabled="mediaType === 'collection'">
      Options
    </v-btn>
  </template>

  <v-list bg-color="grey-darken-4">
    <v-list-item @click="startAdd('watchlist')" class="hover-item">
      <v-list-item-title>Add to Watchlist</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleCollectionAdd" class="hover-item">
      <v-list-item-title>Add to Collection</v-list-item-title>
    </v-list-item>
  </v-list>
</v-menu>

      <v-dialog v-model="showDialog" max-width="500">
        <v-card :theme="darkMode ? 'dark' : 'light'">
          <v-card-title class="text-h5">
            {{ addMode === 'watchlist' ? 'Add to Watchlist' : 'Add to Collection' }}
          </v-card-title>

          <v-card-text>
            <v-select v-model="selectedWatchlist"
                      :items="addMode === 'watchlist' ? watchlists : collections"
                      :label="addMode === 'watchlist' ? 'Select watchlist' : 'Select collection'"
                      item-title="name"
                      :item-value="addMode === 'watchlist' ? 'watchListID' : 'collectionID'"
                      variant="outlined" />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="showDialog = false">Cancel</v-btn>
            <v-btn color="primary" variant="text" @click="addToSelectedTarget">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { getService } from '@/api/GetService';
  import { useMovieStore } from '@/stores/movieStore';
  const { fetchMovies } = useMovieStore();
  const emit = defineEmits(['refresh']);
  const darkMode = ref(true);
  const showDialog = ref(false);
  const selectedWatchlist = ref(null);
  const addMode = ref<'watchlist' | 'collection'>('watchlist');

  const props = defineProps({
    to: { type: String, required: true },
    mediaId: { type: Number, required: true },
    title: { type: String, required: true },
    mediaType: { type: String, required: true },
    posterPath: { type: String, required: false },
    isInCollection: { type: Boolean, required: true }
  });

  const startAdd = async (mode: 'watchlist' | 'collection') => {
    addMode.value = mode;
    if (mode === 'watchlist') {
      await loadWatchlists();
    } else {
      await loadCollections();
    }
    showDialog.value = true;
  };

  const collections = ref<Watchlist[]>([]);

  const loadCollections = async () => {
    const response = await fetch('/api/collection/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('apikey')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch collections');
    collections.value = await response.json() || [];
  };

  const handleCollectionAdd = () => {
    if (props.isInCollection) return;
    startAdd('collection');
  };

  interface Watchlist {
    watchListID: number;
    name: string;
    userID: number;
  }

  const watchlists = ref<Watchlist[]>([]);

  const loadWatchlists = async () => {
    const response = await fetch('/api/watchlist/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('apikey')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch watchlists');
    watchlists.value = await response.json() || [];
  };

  const addToSelectedTarget = async () => {
    if (!selectedWatchlist.value) return;
    if (addMode.value === 'collection' && props.isInCollection) return;

    try {
      if (addMode.value === 'watchlist') {
        await getService.addMovieToWatchlist(selectedWatchlist.value, props.mediaId);
      } else {
        if (props.mediaType === 'movie') {
          await getService.addToCollection(selectedWatchlist.value, props.mediaId, undefined);
        } else if (props.mediaType === 'tv') {
          await getService.addToCollection(selectedWatchlist.value, undefined, props.mediaId);
        }
      }

      showDialog.value = false;
      await fetchMovies(true);
      
     
      emit('refresh');
    } catch (error) {
      console.error('Error adding to target:', error);
    }
  };

  const posterImage = ref('');

  const setPosterImage = () => {
    if (props.posterPath) {
      if (props.posterPath.startsWith('http')) {
        posterImage.value = props.posterPath;
      } else if (props.posterPath.startsWith('/')) {
        posterImage.value = `https://image.tmdb.org/t/p/original${props.posterPath}`;
      } else {
        posterImage.value = props.posterPath;
      }
    } else {
      if (props.mediaType === 'movie') {
        posterImage.value = `/api/movies/${props.mediaId}/poster`;
      } else if (props.mediaType === 'tv') {
        posterImage.value = `/api/tvshow/${props.mediaId}/poster`;
      } else if (props.mediaType === 'collection') {
        posterImage.value = `/api/collections/${props.mediaId}/poster`;
      } else {
        posterImage.value = 'https://placehold.co/300x450?text=No+Poster';
      }
    }
  };

  const fetchPoster = async () => {
    try {
      const response = await fetch(posterImage.value, { method: 'HEAD' });
      if (!response.ok) {
        await getService.getPoster(props.mediaType, props.mediaId);
        setTimeout(setPosterImage, 2000);
      }
    } catch {
      posterImage.value = 'https://placehold.co/300x450?text=No+Poster';
    }
  };

  watch(
    () => [props.mediaId, props.mediaType, props.posterPath],
    () => {
      setPosterImage();
      if (!props.posterPath) fetchPoster();
    },
    { immediate: true }
  );

  const playVideo = async () => {
    try {
      const response = await getService.getVideoID(Number(props.mediaId));
      const videoId = response.data;
      if (!videoId || videoId < 0) throw new Error('Invalid video ID received');
      await getService.getVideoStream(videoId);
    } catch (err) {
      console.error('Failed to play video:', err);
    }
  };

  const handleImageError = (e: Event) => {
    (e.target as HTMLImageElement).src = 'https://placehold.co/300x450?text=No+Poster';
  };

  onMounted(() => {
    setPosterImage();
    if (!props.posterPath) fetchPoster();
    loadWatchlists();
  });
</script>

<style scoped>
  .movie-card {
    display: flex;
    flex-direction: column;
    width: 160px;
    max-width: 160px;
    width: 100%;
  }

  .poster-link {
    display: block;
    text-decoration: none;
    position: relative;
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
    transition: transform 0.3s ease;
  }

  .poster-link:hover .poster-image {
    transform: scale(1.05);
  }

  .overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
    padding: 16px;
  }

  .button-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }

  .collection-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: white;
    color: black;
    font-weight: bold;
    font-size: 0.8rem;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 4px rgba(0,0,0,0.5);
  }
</style>
