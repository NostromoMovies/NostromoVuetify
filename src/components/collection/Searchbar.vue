<template>
  <div class="search-bar">
    <input type="text"
           v-model="searchQuery"
           placeholder="Search..."
           @input="onSearch"
           class="search-input" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { debounce } from 'lodash'

const searchQuery = ref(''); // Reactive variable

  const emit = defineEmits(['search-selected']);

// Debounced search function
const onSearch = debounce(() => {
  emit('search-selected', searchQuery.value);
}, 300); // Adjust the debounce delay (in ms) to your needs
</script>

<style scoped>
  .search-bar {
    display: flex;
    justify-content: left;
    margin: 1rem 0;
  }

  .search-input {
    width: 50%;
    max-width: 400px;
    border-radius: 5px;
    padding: 0.5rem;
    font-size: 1rem;
    background: rgb(34,34,34);
    color: rgb(255, 255, 255);
    border: none;
    outline: none;
  }
</style>
