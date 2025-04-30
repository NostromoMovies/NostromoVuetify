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
        :search = "search"
        :filterOrder="filterOrder"
      />
      <FilterBox 
        @genre-selected="updateGenres"
        @media-selected="updateMedia"
        @year-changed="updateYearRange"
        @runtime-changed="updateRuntime"
      />
    </div>
    <!-- Add this empty div for bottom spacing -->
    <div class="bottom-spacer"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DashboardTaskBar from "./collection/DashboardTaskBar.vue";
import MovieGrid from "./collection/MovieGrid.vue";
import FilterBox from "./collection/FilterBox.vue";


// Define the types for the props we will use
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

    const selectedMedia = ref<string | null>(null);
    const yearRange = ref<YearRange>({ startYear: null, endYear: null });
    const runtime = ref<number>(90);
    const search = ref<string>("");
    const filterOrder = ref<number>(1);

    // Methods to update the state
    const updateGenres = (genres: number[]) => {
    selectedGenres.value = genres;
    };

    const updateMedia = (media: string | null) => {
      selectedMedia.value = media;
    };

    const updateYearRange = (years: YearRange) => {
      yearRange.value = years;
    };

    const updateSearch = (newSearch: string) => {
      search.value = newSearch;
      console.log(search.value)
    };

    const updateFilter = (newFilter: number) => {
      filterOrder.value = newFilter;
      console.log(filterOrder.value)
    };

    const updateRuntime = (newRuntime: number) => {
      runtime.value = newRuntime;
    };

    // Return all the variables and methods to the template
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
  padding-bottom: 80px; /* Increased bottom padding */
  overflow-y: auto;
  position: relative; /* Needed for absolute positioning if used */
}

.main-content {
  display: flex;
  gap: 20px;
  width: 100%;
  margin-bottom: 40px; /* Additional margin at bottom */
}

/* New spacer element */
.bottom-spacer {
  height: 60px;
  width: 100%;
}
</style>