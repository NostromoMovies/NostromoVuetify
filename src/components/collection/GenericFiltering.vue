<template>
  <div class="text-center">
    <v-menu location="bottom end" origin="bottom left">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" dark v-bind="props">
          {{ selectedButtonLabel }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item class="custom-list"
                     v-for="item in items"
                     :key="item.id"
                     @click="handleItemClick(item)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from "vue";

  // ✅ Move the interface outside of setup
  export interface FilterItem {
    id: number;
    title: string;
  }

  export default defineComponent({
    emits: ["filter-selected"],
    setup(_, { emit }) {
      const items = ref<FilterItem[]>([
        { id: 0, title: "Most Popular" },
        { id: 2, title: "Highest Rated" },
        { id: 3, title: "Recently Added" },
        { id: 1, title: "Alphabetical" },
      ]);

      const selectedButtonLabel = ref<string>("Most Popular");

      const handleItemClick = (item: FilterItem) => {
        selectedButtonLabel.value = item.title;
        emit("filter-selected", item.id); // Emit filter ID
      };

      return {
        items,
        selectedButtonLabel,
        handleItemClick,
      };
    },
  });
</script>

<style scoped>
  .text-center {
    text-align: center;
  }

  .custom-list {
    background-color: #2d2d2d;
    color: white;
  }
</style>
