<template>
    <div class="filter-tag">
      <v-btn
        class="tag-button"
        :class="{'selected': isSelected}"
        outlined
        @click="toggleSelection"
      >
        {{ label }}
      </v-btn>
    </div>
  </template>

  <script>
  export default {
    name: "FilterTag",
    props: {
      label: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        isSelected: false, // State to track if the tag is selected
      };
    },
    methods: {
      toggleSelection() {
        this.isSelected = !this.isSelected; // Toggle selection
        this.$emit("toggle", { label: this.label, selected: this.isSelected }); // Emit event with selection state
      },
    },
  };
  </script>

  <style scoped>
  .tag-button {
    border-radius: 20px;
    text-transform: none;
    background-color: #2c2c2c; /* Dark background */
    border: 1px solid #87cefa; /* Light blue border */
    color: #87cefa; /* Light blue text color */
    font-weight: 500;
    padding: 5px 15px;
    font-size: 14px;
  }

  .tag-button:hover {
    background-color: #3d3d3d; /* Slightly lighter dark background on hover */
    border-color: #b0e0ff; /* Brighter blue border on hover */
    color: #b0e0ff;
  }

  .selected {
    background-color: #87cefa; /* Light blue background when selected */
    color: #2c2c2c; /* Dark text color when selected */
    border-color: #b0e0ff; /* Brighter blue border when selected */
  }

  .filter-tag {
    margin-bottom: 10px;
  }
  </style>
  >
