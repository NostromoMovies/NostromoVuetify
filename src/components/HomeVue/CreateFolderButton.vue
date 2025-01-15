<!-- CreateFolderButton.vue -->
<template>
    <button class="folder-button" @click="handleClick">
      <span>Create Folder</span>
    </button>
  </template>
  
  <script setup lang="ts">
  import { defineEmits } from "vue";
  
  // Define emit event
  const emit = defineEmits<{
    (event: "toggle-popup", show: boolean): void;
  }>();
  
  // Handle button click
  const handleClick = () => {
    console.log('Button clicked!');
    emit("toggle-popup", true); // Emit event to show the popup
  };
  </script>
  
  <style scoped>
  .folder-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem; /* Spacing between icon and text */
    padding: 0.8rem 1.2rem;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #666; /* Green background */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s, background-color 0.2s;
  }
  
  .folder-button:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
  
  .icon {
    font-size: 1.2rem; 
  }
  </style>
  