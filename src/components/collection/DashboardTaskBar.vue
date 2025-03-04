<template>
  <div class="taskbar">
    <Searchbar class="taskbar__search" @search-selected="handleSearchSelected" />
    <GenericFiltering class="taskbar__filter" @filter-selected="handleFilterSelected" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import Searchbar from "./Searchbar.vue";
  import GenericFiltering from "./GenericFiltering.vue";

export default defineComponent({
  name: "DashboardTaskBar",
  components: {
    Searchbar,
    GenericFiltering,
  },
  emits: ["filter-updated", "search-updated"], // Event names that will be emitted
  setup(_, { emit }) {
    const handleFilterSelected = (filterId: number) => {
      emit("filter-updated", filterId); // Emit updated filter ID to parent
    };
    const handleSearchSelected = (query: number) => {
      emit("search-updated", query); // Emit updated search query to parent
    };

      return {
        handleFilterSelected,
        handleSearchSelected,
      };
    },
  });
</script>


<style scoped>
  .taskbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 80px;
    padding: 0 20px;
    background-color: rgb(34, 34, 34);
    border: 1px solid rgb(24, 24, 24);
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .taskbar__search {
    flex: 1;
    margin-right: 10px;
  }

  .taskbar__filter {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .taskbar {
      flex-direction: column;
      height: auto;
      padding: 10px;
    }

    .taskbar__search {
      margin: 0 0 10px 0;
    }
  }
</style>
