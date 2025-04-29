<template>
  <v-card>
    <v-card-title>Genre Word Cloud</v-card-title>
    <v-card-text>
      <div v-if="loading" class="text-center py-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else ref="wordcloud" class="word-cloud-container"></div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { getService } from '@/api/GetService';

interface Word {
  text: string;
  size: number;
  count: number;
  x?: number;
  y?: number;
  rotate?: number;
}

export default defineComponent({
  name: 'GenreWordCloud',
  props: {
    colors: {
      type: Array as () => string[],
      default: () => ['#1867C0', '#5CBBF6', '#7E57C2', '#E53935', '#FB8C00']
    },
    minFontSize: {
      type: Number,
      default: 14
    },
    maxFontSize: {
      type: Number,
      default: 72
    }
  },
  setup(props) {
    const loading = ref(false);
    const words = ref<Word[]>([]);
    const wordcloud = ref<HTMLElement | null>(null);

    const fetchGenreData = async () => {
      loading.value = true;
      try {
        const response = await getService.getGenreCount();
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid data format from API');
        }
        return response.data.map(item => ({
          text: String(item.name || item.genreName || 'Unknown'),
          count: Number(item.count || 1),
          size: 0 // Will be calculated in scaleSizes
        })).filter(item => item.count > 0);
      } catch (error) {
        console.error('Error fetching genre data:', error);
        return [];
      } finally {
        loading.value = false;
      }
    };

    const scaleSizes = (words: Word[]) => {
      if (words.length === 0) return words;
      
      const counts = words.map(w => w.count);
      const minCount = Math.min(...counts);
      const maxCount = Math.max(...counts);

    
      if (minCount === maxCount) {
        const sizeStep = (props.maxFontSize - props.minFontSize) / words.length;
        return words.map((word, i) => ({
          ...word,
          size: props.minFontSize + (i * sizeStep)
        }));
      }

 
      const scale = d3.scaleLinear()
        .domain([minCount, maxCount])
        .range([props.minFontSize, props.maxFontSize])
        .clamp(true);

      return words.map(word => ({
        ...word,
        size: scale(word.count)
      }));
    };

    const generateWordCloud = () => {
      if (!wordcloud.value || words.value.length === 0) return;

      const width = wordcloud.value.clientWidth;
      const height = 500;

    
      d3.select(wordcloud.value).selectAll('*').remove();

  
      const layout = cloud()
        .size([width, height])
        .words(words.value.map(w => ({ ...w }))) 
        .padding(8)
        .rotate(() => Math.random() < 0.7 ? 0 : 90)
        .font('sans-serif')
        .fontSize(d => d.size)
        .on('end', drawWordCloud);

      layout.start();
    };

    const drawWordCloud = (cloudWords: Word[]) => {
      if (!wordcloud.value) return;

      const width = wordcloud.value.clientWidth;
      const height = 500;

      const svg = d3.select(wordcloud.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

      const g = svg.append('g')
        .attr('transform', `translate(${width/2},${height/2})`);

      g.selectAll('text')
        .data(cloudWords)
        .enter()
        .append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'sans-serif')
        .style('fill', (_, i) => props.colors[i % props.colors.length])
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .append('title')
        .text(d => `${d.text}: ${d.count} items`);

     
      g.selectAll('text')
        .text(d => d.text);
    };

    onMounted(async () => {
      const rawWords = await fetchGenreData();
      words.value = scaleSizes(rawWords);
      generateWordCloud();
      window.addEventListener('resize', generateWordCloud);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', generateWordCloud);
    });

    return {
      loading,
      wordcloud
    };
  }
});
</script>

<style scoped>
.word-cloud-container {
  width: 100%;
  height: 500px;
  margin: 0 auto;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style>