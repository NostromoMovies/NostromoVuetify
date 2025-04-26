<script setup lang="ts">
import Dashboard from '@/components/DashboardSection.vue';
</script>

<template>
  <main class="main-container">
    <!-- Dashboard Section -->
    <section class="dashboard-section">
      <Dashboard />
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
  overflow-y: auto;
}


.dashboard-section {
  width: 100%;
}
</style>
