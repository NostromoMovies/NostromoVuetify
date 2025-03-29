<script setup lang="ts">
import CollectionSectionVue from '../components/CollectionSection.vue'

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
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  width: 100vw;
  
  margin: 0;
  padding: 20px;
  position: fixed;
  top: 50;
  left: 0;
}

.navbar-section {
  width: 100%; /* Ensure NavBar takes the full width */
}

.collection-section {
  width: 100%; /* Ensure DashboardSection takes the full width */
}
</style>
