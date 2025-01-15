<template>
    <button class="three-line-button" @click="handleClick">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </template>
  
  <script setup>
  const handleClick = () => {
    console.log('Button clicked!')
  }
  </script>
  
  <style scoped>
  .three-line-button {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 40px;
    height: 30px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  
  .three-line-button span {
    display: block;
    width: 100%;
    height: 4px;
    background-color: black;
    border-radius: 2px;
    transition: background-color 0.3s, transform 0.3s;
  }
  
  .three-line-button:hover span {
    background-color: gray;
  }
  </style>
  