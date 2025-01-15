<template>
    <slot v-if="isAuthenticated"></slot>
    <router-link v-else :to="`/login?redirectTo=${currentPath}`"></router-link>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from '@/stores/authStore'
  import { useRoute } from 'vue-router'
  import { computed } from 'vue'
  
  const authStore = useAuthStore()
  const route = useRoute()
  
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const currentPath = computed(() => encodeURIComponent(route.fullPath))
  </script>