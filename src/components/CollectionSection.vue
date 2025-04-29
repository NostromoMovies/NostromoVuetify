<template>
  <div class="app-container">
    <DashboardTaskBar
      @search-updated="updateSearch"
      @filter-updated="updateFilter"
    />
    <div class="main-content">
      <!-- Pass filter data as props to MovieGrid -->
      <MovieGrid 
        :selectedGenres="selectedGenres"
        :selectedMedia="selectedMedia"
        :yearRange="yearRange"
        :runtime="runtime"
        :search="search"
        :filterOrder="filterOrder"
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

<script lang="ts">
import { defineComponent, ref } from "vue";
import DashboardTaskBar from "./collection/DashboardTaskBar.vue";
import MovieGrid from "./collection/MovieGrid.vue";
import FilterBox from "./collection/FilterBox.vue";

interface YearRange {
  startYear: number | null;
  endYear: number | null;
}

export default defineComponent({
  name: "BoxSection",
  components: {
    MovieGrid,
    FilterBox,
    DashboardTaskBar,
  },
  setup() {
    // Define the reactive state with correct types
    const selectedGenres = ref<number[]>([]);
    const selectedMedia = ref<string[]>(['movie', 'tv']); // Default to both selected
    const yearRange = ref<YearRange>({ startYear: null, endYear: null });
    const runtime = ref<number>(90);
    const search = ref<string>("");
    const filterOrder = ref<number>(1);

    // Methods to update the state
    const updateGenres = (genres: number[]) => {
      selectedGenres.value = genres;
    };

    const updateMedia = (media: string[] | null) => {
      // If null is passed (meaning all were deselected), default to both
      selectedMedia.value = media || ['movie', 'tv'];
    };

    const updateYearRange = (years: [number | null, number | null]) => {
      yearRange.value = {
        startYear: years[0],
        endYear: years[1]
      };
    };

    const updateSearch = (newSearch: string) => {
      search.value = newSearch;
    };

    const updateFilter = (newFilter: number) => {
      filterOrder.value = newFilter;
    };

    const updateRuntime = (newRuntime: number) => {
      runtime.value = newRuntime;
    };

    return {
      selectedGenres,
      selectedMedia,
      yearRange,
      runtime,
      search,
      filterOrder,
      updateGenres,
      updateMedia,
      updateYearRange,
      updateRuntime,
      updateSearch,
      updateFilter,
    };
  },
});
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  padding: 40px;
  overflow-y: auto;
}

.main-content {
  display: flex;
  gap: 20px;
  width: 100%;
}
</style>