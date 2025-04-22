<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h5">Genre Word Cloud</v-card-title>
      <v-card-text>
        <div class="canvas-container" ref="canvasContainer">
          <canvas 
            ref="wordCloudCanvas"
            class="word-cloud-canvas"
            v-if="!loading"
          ></canvas>
          <v-progress-circular
            v-else
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="generateWordCloud" color="primary" :loading="loading">
          Regenerate
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from 'vue';
import WordCloud from 'wordcloud';
import { getService } from '@/api/GetService';

interface GenreCount {
  name: string;
  count: number;
}

export default defineComponent({
  name: 'GenreWordCloud',
  setup() {
    const wordCloudCanvas = ref<HTMLCanvasElement | null>(null);
    const canvasContainer = ref<HTMLElement | null>(null);
    const loading = ref(false);
    const genreData = ref<GenreCount[]>([]);

    const fetchGenreData = async (): Promise<GenreCount[]> => {
      loading.value = true;
      try {
        const response = await getService.getGenreCount();
        
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid data format from API');
        }

        return response.data.map(item => ({
          name: String(item.name || item.genreName || item.GenreName || 'Unknown'),
          count: Number(item.count || item.totalCount || item.Count || 1)
        })).filter(item => item.count > 0);
      } catch (error) {
        console.error('Error fetching genre data:', error);
        return [];
      } finally {
        loading.value = false;
      }
    };

    const initializeCanvas = (): void => {
      if (!wordCloudCanvas.value || !canvasContainer.value) return;
      
      const container = canvasContainer.value;
      const pixelRatio = window.devicePixelRatio || 1;
      
      const displayWidth = Math.min(container.clientWidth, 1000);
      const displayHeight = Math.min(displayWidth * 0.625, 600);
      
      wordCloudCanvas.value.width = displayWidth * pixelRatio;
      wordCloudCanvas.value.height = displayHeight * pixelRatio;
      
      wordCloudCanvas.value.style.width = `${displayWidth}px`;
      wordCloudCanvas.value.style.height = `${displayHeight}px`;
      
      const ctx = wordCloudCanvas.value.getContext('2d');
      if (ctx) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.font = '10px sans-serif';
      }
    }

    const generateWordCloud = async (): Promise<void> => {
      if (!wordCloudCanvas.value) {
        console.error('Canvas element not found');
        return;
      }
      
      loading.value = true;
      try {
        initializeCanvas();
        const genres = await fetchGenreData();
        
        if (genres.length === 0) {
          console.warn('No genre data received');
          return;
        }

        const validGenres = genres.filter(genre => 
          !isNaN(genre.count) && genre.count > 0 && genre.name.trim()
        );

        if (validGenres.length === 0) {
          console.warn('No valid genre data available');
          return;
        }

        const maxCount = Math.max(...validGenres.map(g => g.count));
        const minCount = Math.min(...validGenres.map(g => g.count));
        
        const scaleFactor = (count: number) => {
          const range = maxCount - minCount;
          if (range <= 0) return 10;
          return 5 + 15 * (Math.log(count - minCount + 1) / Math.log(range + 1));
        };

        const wordList: [string, number][] = validGenres.map(genre => [
          genre.name, 
          scaleFactor(genre.count)
        ]);

        const ctx = wordCloudCanvas.value.getContext('2d');
        if (!ctx) {
          console.error('Could not get canvas context');
          return;
        }

        ctx.clearRect(0, 0, wordCloudCanvas.value.width, wordCloudCanvas.value.height);
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, wordCloudCanvas.value.width, wordCloudCanvas.value.height);

        try {
          WordCloud(wordCloudCanvas.value, {
            list: wordList,
            gridSize: Math.round(Math.sqrt(wordCloudCanvas.value.width / 10)),
            weightFactor: 1,
            fontFamily: 'Roboto, sans-serif',
            color: () => {
              const colors = ['#4FC3F7', '#4DB6AC', '#81C784', '#FFD54F', '#FF8A65', '#9575CD'];
              return colors[Math.floor(Math.random() * colors.length)];
            },
            backgroundColor: '#121212',
            minSize: 8,
            rotateRatio: 0.5,
            rotationSteps: 4,
            drawOutOfBound: false,
            shrinkToFit: true
            // Removed the hover callback completely
          });
        } catch (error) {
          console.error('WordCloud generation error:', error);
        }
      } catch (error) {
        console.error('Error generating word cloud:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      await nextTick();
      initializeCanvas();
      window.addEventListener('resize', initializeCanvas);
      generateWordCloud();
    });

    return {
      wordCloudCanvas,
      canvasContainer,
      loading,
      generateWordCloud
    };
  }
});
</script>

<style scoped>
.canvas-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  min-height: 500px;
  background-color: #121212;
  border: 1px solid #333;
}

.word-cloud-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>