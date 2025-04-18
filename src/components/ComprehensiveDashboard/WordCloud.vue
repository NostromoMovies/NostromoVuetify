<template>
    <div>
      <canvas ref="canvas" width="800" height="400"></canvas>
      <div>
        <input v-model="newWord.text" placeholder="Word" />
        <input v-model.number="newWord.weight" type="number" placeholder="Weight" />
        <button @click="addWord">Add Word</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import WordCloud from 'wordcloud'; // Default import (fixed)
  
  interface Word {
    text: string;
    weight: number;
  }
  
  export default defineComponent({
    name: 'WordCloudComponent',
    setup() {
      const canvasRef = ref<HTMLCanvasElement | null>(null);
      const newWord = ref<Word>({ text: '', weight: 1 });
      const words = ref<Word[]>([
        { text: 'Vue', weight: 10 },
        { text: 'JavaScript', weight: 9 },
        { text: 'Vue.js', weight: 8 },
        { text: 'Web', weight: 7 },
        { text: 'Development', weight: 6 },
        { text: 'Frontend', weight: 5 },
        { text: 'Cloud', weight: 4 },
        { text: 'Component', weight: 3 },
        { text: 'App', weight: 2 },
        { text: 'Design', weight: 1 },
      ]);
  
      const createWordCloud = () => {
        if (canvasRef.value) {
          WordCloud(canvasRef.value, {
            list: words.value.map((word) => [word.text, word.weight]),
            gridSize: 10,
            weightFactor: 5,
            fontFamily: 'Arial',
            color: 'random-light',
            rotateRatio: 0.5,
            rotationSteps: 3,
          });
        }
      };
  
      const addWord = () => {
        if (newWord.value.text && newWord.value.weight > 0) {
          words.value.push({ ...newWord.value });
          newWord.value.text = '';
          newWord.value.weight = 1;
          createWordCloud(); // Recreate word cloud after adding the word
        }
      };
  
      onMounted(() => {
        createWordCloud();
      });
  
      return {
        canvasRef,
        newWord,
        words,
        addWord,
      };
    },
  });
  </script>
  
  <style scoped>
  canvas {
    border: 1px solid black;
    margin-bottom: 20px;
  }
  
  input {
    margin: 5px;
    padding: 5px;
  }
  button {
    padding: 5px 10px;
  }
  </style>
  