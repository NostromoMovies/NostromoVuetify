<template>
  <div>
    <canvas ref="canvas" width="800" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import WordCloud from 'wordcloud';
import { getService } from '@/api/GetService';

interface Word {
  text: string;
  weight: number;
}

interface GenreCount {
  genre: string;
  count: number;
}

export default defineComponent({
  name: 'WordCloudComponent',
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const words = ref<Word[]>([]);

    const createWordCloud = () => {
      if (canvasRef.value && words.value.length > 0) {
        WordCloud(canvasRef.value, {
          list: words.value.map(word => [word.text, word.weight]),
          gridSize: 10,
          weightFactor: 5,
          fontFamily: 'Arial',
          color: 'random-light',
          rotateRatio: 0.5,
          rotationSteps: 3,
        });
      }
    };

    const loadGenreCounts = async () => {
      try {
        const response = await getService.getGenreCount();
        const genreCounts: GenreCount[] = response.data?.data || [];

        words.value = genreCounts.map(gc => ({
          text: gc.genre,
          weight: gc.count,
        }));

        createWordCloud();
      } catch (error) {
        console.error('Failed to load genre count:', error);
      }
    };

    onMounted(() => {
      loadGenreCounts();
    });

    return {
      canvasRef,
    };
  },
});
</script>

<style scoped>
canvas {
  border: 1px solid black;
  margin-bottom: 20px;
}
</style>
