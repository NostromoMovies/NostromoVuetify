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
  height: 120vh;
  padding: 20px;
  width: 100vw;
}

.dashboard-section {
  width: 100%;
}
</style>
