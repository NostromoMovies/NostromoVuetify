<script setup lang="ts">
</script>

<template>
  <main class="main-container">
    <h1 class="nostromo-logo">Welcome</h1>
  </main>
</template>

<style scoped>
@font-face {
  font-weight: normal;
  font-style: normal;
}

html, body, #app, .v-application {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: rgb(34,34,34);
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
}

.nostromo-logo {
  font-family: "Nostromo3D", sans-serif;
  font-size: 4rem;
  color: rgb(65, 240, 11);
  margin: 0;
  padding: 0;
  letter-spacing: 1px;
  line-height: 1;
}
</style>