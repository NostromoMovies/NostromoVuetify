<template>
  <div class="parent">
    <div class="grid-container">
      <div class="rectangle">
        <div class="content-wrapper">
          <WordCloud></WordCloud>
        </div>
      </div>

      <div class="rectangle">
        <div>
          <h1>Watchlists</h1>

        </div>
        <CreateList></CreateList>

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
import WordCloud from './ComprehensiveDashboard/WordCloud.vue';
import CreateList from './HomeVue/CreateList.vue';
import CreateCollection from './HomeVue/CreateCollection.vue'

</script>

<style scoped>
* {
  box-sizing: border-box;
}

.parent {
  margin-top: 50px;
  padding: 20px;
  /* Remove height: 100vh - this was preventing bottom space */
  min-height: 100vh; /* Allows content to expand beyond viewport */
  width: 100vw;
  padding-bottom: 80px; /* Add your desired bottom gap */
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(600px, auto); /* Allows rows to grow taller */
  padding-top: 15px;
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
  margin-bottom: 40px; /* Extra bottom space */
}

.rectangle {
  background-color: rgb(34,34,34);
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-height: 600px; /* Changed from fixed height */
  position: relative;
  display: flex;
  flex-direction: column;
  /* Remove overflow-y: auto if you want page to scroll instead */
}
</style>
