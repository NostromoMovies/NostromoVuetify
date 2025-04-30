<script setup lang="ts">
import SettingBox from '@/components/collection/SettingBox.vue';
import CollectionDetail from '@/components/CollectionDetail.vue'
</script>

<template>
  <main class="main-container">
    
   <CollectionDetail></CollectionDetail>
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
  width: 190vh;
}


</style>
