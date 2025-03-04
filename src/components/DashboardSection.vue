<template>
  <div class="parent">
    <div class="grid-container">
      <div class="rectangle">
        <div class="content-wrapper">
          <UnrecognizedFileBox />
        </div>
      </div>

      <div class="rectangle">
        <UnrecognizedMovies />
      </div>

      <div class="rectangle">
        <DownloadProgress />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UnrecognizedFileBox from './HomeVue/ImportFolderBox.vue';
import UnrecognizedMovies from './HomeVue/UnrecognizedMovies.vue';
import DownloadProgress from './HomeVue/DownloadProgress.vue';
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.parent {
  margin-top: 50px;
  padding: 20px;
  width: 100%;
  max-width: 200vh;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 600px;
  padding-top: 15px;
  padding-bottom: 15px;
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.rectangle {
  background-color: rgb(34,34,34);
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>
