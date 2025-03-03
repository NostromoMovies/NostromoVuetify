<template>
  <div class="app-container">
    <DashboardTaskBar />
    <div class="main-content">
      <!-- Pass filter data as props to MovieGrid -->
      <MovieGrid 
        :selectedGenres="selectedGenres"
        :selectedMedia="selectedMedia"
        :yearRange="yearRange"
        :runtime="runtime"
      />
      <FilterBox 
        @genre-selected="updateGenres"
        @media-selected="updateMedia"
        @year-changed="updateYearRange"
        @runtime-changed="updateRuntime"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import DashboardTaskBar from "./collection/DashboardTaskBar.vue";
import MovieGrid from "./collection/MovieGrid.vue";
import FilterBox from "./collection/FilterBox.vue";

export default {
  name: "BoxSection",
  components: {
    MovieGrid,
    FilterBox,
    DashboardTaskBar,
  },
  setup() {
    const selectedGenres = ref([]);
    const selectedMedia = ref(null);
    const yearRange = ref({ startYear: null, endYear: null });
    const runtime = ref(90);

    const updateGenres = (genres) => {
      selectedGenres.value = genres;
    };

    const updateMedia = (media) => {
      selectedMedia.value = media;
    };

    const updateYearRange = (years) => {
      yearRange.value = years;
    };

    const updateRuntime = (newRuntime) => {
      runtime.value = newRuntime;
    };

    return {
      selectedGenres,
      selectedMedia,
      yearRange,
      runtime,
      updateGenres,
      updateMedia,
      updateYearRange,
      updateRuntime,
    };
  },
};
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  padding: 40px;
}

.main-content {
  display: flex;
  gap: 20px;
  width: 100%;
}
</style>
