<script setup lang="ts">
import CollectionSectionVue from '../components/CollectionSectionTV.vue'

</script>

<template>
  <main class="main-container">
    <!-- NavBar Section -->
    <section class="navbar-section">
      <!-- <NavBar /> -->
    </section>

    <!-- Collection Section -->
    <section class="collection-section">
      <CollectionSectionVue />
    </section>
  </main>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column; /* Arrange sections vertically */
  justify-content: flex-start; /* Align items to the top of the container */
  align-items: center; /* Center items horizontally */
  height: 100vh; /* Full screen height */
  width: 190vh;
  padding: 20px; /* Optional: Add padding for spacing around the container */
}

.navbar-section {
  padding: 40px;
  width: 100%; /* Ensure NavBar takes the full width */
  margin-bottom: 20px; /* Space between NavBar and DashboardSection */
}

.collection-section {
  width: 100%; /* Ensure DashboardSection takes the full width */
}
</style>
