<template>
    <div class="taskbar">
      <Searchbar class="taskbar__search" />
      <FilterButton class="taskbar__filter" />
    </div>
  </template>
  
  <script>
  import Searchbar from './Searchbar.vue';
  import FilterButton from './FilterButton.vue';
  
  export default {
    name: "DashboardTaskBar",
    components: {
      Searchbar,
      FilterButton,
    },
  };
  </script>
  
  <style scoped>
  /* General container styles */
  .taskbar {
    display: flex;
    flex-direction: row; /* Ensure horizontal alignment */
    justify-content: space-between; /* Space out children */
    align-items: center;
    width: 100%;
    height: 80px; /* Reduced height for a more compact look */
    padding: 0 20px; /* Horizontal padding for content spacing */
    background-color: #f9f9f9; /* Subtle background color */
    border: 1px solid #e0e0e0; /* Softer border color */
    border-radius: 10px; /* Slightly more rounded corners */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); 
  }
  
  
  .taskbar__search {
    flex: 1; 
    margin-right: 10px; 
  }
  
  .taskbar__filter {
    flex-shrink: 0; 
  }
  
  @media (max-width: 768px) {
    .taskbar {
      flex-direction: column; 
      height: auto; 
      padding: 10px;
    }
  
    .taskbar__search {
      margin: 0 0 10px 0; 
    }
  }
  </style>
  