<script setup lang="ts">

import WordCloud from '@/components/ComprehensiveDashboard/WordCloud.vue';


</script>

<template>
  <main class="main-container">
    <WordCloud></WordCloud>
  </main>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  padding: 20px;
  width: 100vw; 

  color: red;
}


</style>
