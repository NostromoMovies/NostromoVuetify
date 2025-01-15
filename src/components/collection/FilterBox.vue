<template>
    <div class="filter-box">
      <h3>Filter Options</h3>
     
    </div>
  </template>
  
  <script>
  export default {
    name: "FilterBox",
  };
  </script>
  
  <style scoped>
  .filter-box {
    background-color: var(--color-background-soft);
    margin-top: 50px;
    width: 430px;
    border-radius: 5px;
    height: 1800px;
    padding: 1rem;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    margin-left: auto;
    color: var(--color-text);
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  
  </style>
  