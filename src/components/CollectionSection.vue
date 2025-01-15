<template>
  <div class="app-container">
    <DashboardTaskBar></DashboardTaskBar>
    <!-- <div class="content">
      <div class="search-container">
        <input 
          type="search" 
          placeholder="Search..." 
          class="search-input"
        />
      </div> -->
      <div class="main-content">
        <MovieGrid />
        <FilterBox />
      </div>
    </div>

</template>

<script>
import DashboardTaskBar from './collection/DashboardTaskBar.vue';
import MovieGrid from './collection/MovieGrid.vue';
import FilterBox from './collection/FilterBox.vue';

 
  export default {
    name: 'BoxSection', 
    components: {
      MovieGrid,
      FilterBox,
      DashboardTaskBar
},
  };
  </script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  padding: 40px;
}

.content {
  max-width: 100%;
  width: 100%;
  margin: 30px;
}

.search-container {
  width: 100%;
  margin:  0;
  padding: 0;
  max-width: 25%
}

.search-input {
  width: 100%;
  padding: 12px;
  border: none;
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 16px;
}

.main-content {
  display: flex;
  gap: 20px;
  width: 100%;
}
</style>