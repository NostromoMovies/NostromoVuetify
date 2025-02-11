<template>
    <v-container class="overflow-container">
      <v-row dense>
        <v-col v-for="actor in actors" :key="actor.id" cols="6" sm="4" md="3" lg="2">
          <v-card class="actor-card" outlined>
            <v-avatar size="100">
              <v-img :src="actor.image" alt="Actor Image" />
            </v-avatar>
            <v-card-text class="text-center">
              {{ actor.name }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  const actors = [
    { id: 1, name: "Actor 1", image: "https://via.placeholder.com/100" },
    { id: 2, name: "Actor 2", image: "https://via.placeholder.com/100" },
    { id: 3, name: "Actor 3", image: "https://via.placeholder.com/100" },
    { id: 4, name: "Actor 4", image: "https://via.placeholder.com/100" },
    { id: 5, name: "Actor 5", image: "https://via.placeholder.com/100" },
    { id: 6, name: "Actor 6", image: "https://via.placeholder.com/100" },
    { id: 7, name: "Actor 7", image: "https://via.placeholder.com/100" },
    { id: 8, name: "Actor 8", image: "https://via.placeholder.com/100" },
  ];
  </script>
  
  <style scoped>
  .overflow-container {
    max-height: 300px; /* Adjust as needed */
    overflow-y: auto;
  }
  
  .actor-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
  }
  </style>
  