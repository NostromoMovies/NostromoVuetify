<template>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        @input="onSearch"
        class="search-input"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { getService } from '@/api/GetService';
  
  const input = ref(""); // Reactive input for search
  const results = ref([]); // Store search results
  
  const searchFilter = async () => {
    try {
      results.value = await getService.searchMedia(input.value); // Await the result and update `results`
    } catch (error) {
      console.error("Search Error", error);
    }
  };
  
  const onSearch = () => {
    searchFilter(); // Trigger the search when `onSearch` is called
  };
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
    background: var(--color-background-soft);
    color: var(--color-text);
    border: none; /* Add this to remove the border */
    outline: none; /* Optional: removes the focus outline */
  }
  </style>
  