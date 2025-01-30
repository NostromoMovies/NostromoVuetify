<template>
    <main class="main-container">
      <!-- NavBar Section -->
      <header class="navbar-section">

      </header>

      <!-- Metadata Section -->
      <section class="movie-data">
        <MetadataLayout />
      </section>
    </main>
  </template>







<script setup lang="ts">
import MetadataLayout from '@/components/MovieDetailComponent/MetadataLayout.vue';


// import { ref } from 'vue';
// import { useRoute } from 'vue-router';
// import axios from 'axios';
// import type { Movie } from  '@/types/index'



// const route = useRoute();
// const movieId = route.params.id as string; // Ensure proper type assertion
// const movieData = ref<Movie | null>(null); // Type the movie data

// onMounted(async () => {
//     try {
//         const response = await axios.get(`/api/movies/${movieId}`);
//         movieData.value = response.data as Movie; // Type assertion for response data
//     } catch (error) {
//         console.error('Error fetching movie data:', error);
//     }
// });

</script>



<style scoped>
.main-container {
  display: flex;
  flex-direction: column; /* Arrange sections vertically */
  justify-content: flex-start; /* Align items to the top of the container */
  align-items: center; /* Center items horizontally */
  height: 100vh; /* Full screen height */
  padding: 20px; /* Optional: Add padding for spacing around the container */
  width: 200vh;
}

.navbar-section {
  padding: 20px;
  width: 100%; /* Ensure NavBar takes the full width */
  margin-bottom: 20px; /* Space between NavBar and DashboardSection */
}
.movie-data{
    padding-top: 30px;
    width: 80%;
}


</style>
