<template>
  <div class="text-center">
    <v-menu location="bottom end" origin="bottom left">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" dark v-bind="props">
          {{ selectedButtonLabel }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          class="custom-list"
          v-for="(item, index) in items"
          :key="index"
          @click="handleItemClick(item.title)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const items = ref([
      { title: 'Most Popular' },
      { title: 'Highest Rated' },
      { title: 'Recently Added' },
      { title: 'Release Date' },
    ]);

    const selectedButtonLabel = ref('Most Popular');

    const handleItemClick = (title: string) => {
      selectedButtonLabel.value = title;
      // Add your sorting logic here based on the selected title
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