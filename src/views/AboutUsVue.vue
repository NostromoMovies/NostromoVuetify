<script setup lang="ts">
</script>

<template>
  <main class="main-container">
    <!-- Dashboard Section -->
    <section class="aboutus-section">
      <v-container>
        <!-- Header Section -->
        <v-card class="pa-4 mb-4" color="primary" dark>
          <!-- <v-img 
            src="/moviecollection.jpg" 
            height="200px" 
            cover
          ></v-img> -->
          <v-card-title class="text-center">About Nostromo</v-card-title>
        </v-card>

        <!-- General Text Section -->
        <v-card class="pa-4">
          <v-card-text>
            Nostromo is a self-hosted, full-stack application for organizing digital movie and television collections. 
            It is deployable on Windows, Linux, or Docker, and accessible via a web browser. Nostromo simplifies file management using file hashing for identification, 
            maintaining collection integrity despite renaming or format changes. It focuses exclusively on management and organization, serving as middleware between 
            your media collection and media server. We aim to refine core functionality, enhance metadata for an improved frontend, integrate with Jellyfin via a plug-in, 
            and develop filtering and recommendation features based on trends, seasons, and user watch history.
          </v-card-text>
        </v-card>

        <v-card class="pa-4 mb-4" color="primary" dark>
          <v-card-title class="text-center">Meet Our Collaborator</v-card-title>
        </v-card>

        <!-- General Text Section -->
        <v-card class="pa-4">
          <v-card-text>
             Teaching Team -    Sara Davis, Vinh Le, Levi Scully
          </v-card-text>
        </v-card>
        <v-card class="pa-4">
          <v-card-text>
             Advisor - Levi Scully
          </v-card-text>
        </v-card>
        <v-card class="pa-4">
          <v-card-text>
            Collaborator - Stolan Belikove, Nicholas Moore, Dominic Pham
          </v-card-text>
        </v-card>
      </v-container>
    </section>
  </main>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  padding: 20px;
  margin: 40px;
  max-width: 1200px; /* Adjusted width */
  width: 100%;
}

.aboutus-section {
  width: 100%;
  padding-top: 20px;
}

.v-card-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
