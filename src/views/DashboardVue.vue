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
  align-items: center;
  height: 100vh;
  padding: 20px; 
  width: 200vh;
}

.dashboard-section {
  width: 100%;
}
</style>