<template>
    <div class="text-center">
      <!-- <v-select
        v-model="location"
        :items="locations"
        label="Location"
      ></v-select> -->

      <v-menu :location="location"
      :origin="'bottom left'">
        <template v-slot:activator="{ props }">
          <v-btn

            color="primary"
            dark
            v-bind="props"
          >
            {{ selectedButtonLabel }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item class="custom-list"
            v-for="(item, index) in items"
            :key="index"
            @click="handleItemClick(item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </template>

  <script lang="ts">
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      // Define types for items
      const items = ref<{ title: string }[]>([
        { title: 'Most Popular' },
        { title: 'Highest Rated' },
        { title: 'Recently Added' },
        { title: 'Release Date' },
      ]);

      // Define types for locations
      const locations = ref<string[]>([
        'top',
        'bottom',
        'start',
        'end',
        'center',
      ]);

      const location = ref<string>('end');

      // Reactive variable for button label, default to "Most Popular"
      const selectedButtonLabel = ref<string>('Most Popular');


      const handleItemClick = (title: string) => {
        selectedButtonLabel.value = title;
        if(title == "HighestRated"){
          
        }
        else if(title == "Recently Addded"){

        }
        else if(title == "Release Date"){

        }
      };

      return {
        items,
        locations,
        location,
        selectedButtonLabel,
        handleItemClick,
      };
    },
  });
  </script>

  <style scoped>
  .text-center {
    text-align: center;
  }
  .custom-list {
  background-color: darkgray !important; /* Solid black background */
  color: white !important; /* White text for contrast */


}
  </style>
