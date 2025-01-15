<script setup lang="ts">
import Dashboard from '@/components/DashboardSection.vue';
import NavBar from '../components/NavBar.vue'
</script>

<template>
  <main class="main-container">
    <!-- NavBar Section -->
    <section class="navbar-section">
      <NavBar />
    </section>

    <!-- Dashboard Section -->
    <section class="dashboard-section">
      <Dashboard />
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
  padding: 20px; /* Optional: Add padding for spacing around the container */
  width: 200vh;
}

.navbar-section {
  padding: 20px;
  width: 100%; /* Ensure NavBar takes the full width */
  margin-bottom: 20px; /* Space between NavBar and DashboardSection */
}

.dashboard-section {
  width: 100%; /* Ensure DashboardSection takes the full width */
 
}
</style>

