<script setup lang="ts">
import Watchlist from '@/components/Watchlist.vue';


</script>

<template>
  <main class="main-container">
    

    <!-- Collection Section -->
    <section class="collection-section">
      <Watchlist />
    </section>
  </main>
</template>

<style scoped>

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
  justify-content: center; /* Center vertically */
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 20px;
  position: relative; /* Use relative unless you specifically need fixed */
}



.collection-section {
  margin: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  overflow-y: auto;
}
</style>
