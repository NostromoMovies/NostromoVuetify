<template>
  <v-app>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

</script>

<style lang="css">
@import "@/assets/main.css";

.v-app {
  font-family: 'C64 Pro', monospace !important;
  text-align: center;
  color: #2c3e50;
  min-height: 100%;

 
  width: 100vw; 
  height: 100vh;
  box-sizing: border-box; 
  margin: 0; 
  padding: 0; 
}

.v-main {
  width: 100%; 
  height: 100%;
  margin: 0;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* Prevent horizontal scrolling */
}
</style>
