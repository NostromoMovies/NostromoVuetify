<template>
    <div class="parent">
    

  
        <div class="rectangle">
            <UnrecognizedMovies></UnrecognizedMovies>
            <UnrecognizedFileBox></UnrecognizedFileBox>
            
            <CreateCollection> </CreateCollection>
           
        </div>
  

      
    </div>
  </template>
  
  <script setup lang="ts">
  
import UnrecognizedMovies from '../HomeVue/UnrecognizedMovies.vue';
import UnrecognizedFileBox from '../HomeVue/ImportFolderBox.vue';
import CreateCollection from '../HomeVue/CreateCollection.vue'

  </script>
  
  <style scoped>
  * {
    box-sizing: border-box;
  }
  
  .parent {
  display: flex;
  justify-content: center; /* center horizontally */
  align-items: center;     /* center vertically */
  height: 100vh;
  width: 100vw;
  padding: 20px;
}

  
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 600px;
    padding-top: 15px;
    padding-bottom: 15px;
    gap: 20px;
    max-width: 1600px;
    margin: 0 auto;
  }
  
  .rectangle {
    background-color: rgb(34,34,34);
    color: #fff;
    padding: 20px;
    border-radius: 8px;

    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    height: 80%;
    width: 60%;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
  }
  .h1{
    font-size: 10px;
  }
  </style>
  