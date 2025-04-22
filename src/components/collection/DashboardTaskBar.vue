<template>
  <div class="taskbar">
    <Searchbar class="taskbar__search" @search-selected="handleSearchSelected" />
    <div class="taskbar__counter">
      <v-chip color="info" variant="outlined">
        Total Videos: {{ videoCount }}
      </v-chip>
    </div>
    <GenericFiltering class="taskbar__filter" @filter-selected="handleFilterSelected" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Searchbar from "./Searchbar.vue";
import GenericFiltering from "./GenericFiltering.vue";
import { getService } from "@/api/GetService";

export default defineComponent({
  name: "DashboardTaskBar",
  components: {
    Searchbar,
    GenericFiltering,
  },
  emits: ["filter-updated", "search-updated"],
  setup(_, { emit }) {
    const videoCount = ref<number>(0);

    const handleFilterSelected = (filterId: number) => {
      emit("filter-updated", filterId);
    };

    const handleSearchSelected = (query: number) => {
      emit("search-updated", query);
    };

    const getVideoCount = async () => {
      try {
        const response = await getService.getMovieCount();
        videoCount.value = response.data; // Directly use response.data
      } catch (error) {
        console.error("Error fetching video count:", error);
        videoCount.value = 0;
      }
    };

    onMounted(() => {
      getVideoCount();
    });

    return {
      handleFilterSelected,
      handleSearchSelected,
      videoCount,
      getVideoCount,
    };
  },
});
</script>

<style scoped>
.taskbar {
  display: flex;
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
  margin-right: 16px;
  max-width: 300px;
}

.taskbar__counter {
  margin: 0 16px;
}

.taskbar__filter {
  flex: 1;
  max-width: 300px;
  display: flex;
  justify-content: flex-end;
  margin-left: 16px;
}

@media (max-width: 768px) {
  .taskbar {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }

  .taskbar__search,
  .taskbar__counter,
  .taskbar__filter {
    margin: 10px 0;
    max-width: 100%;
    width: 100%;
  }
}
</style>