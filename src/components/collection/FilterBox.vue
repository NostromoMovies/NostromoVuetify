<template>
  <div class="filter-box">
    <h3>Genre</h3>
    <v-row
      class="genre-box"
      justify="start"
      no-gutters
    >
      <v-col
        v-for="(genre, index) in genres"
        :key="`genre-${index}`"
        cols="auto"
        class="genre-item"
      >
        <FilterTag :label="genre" />
      </v-col>
    </v-row>

    <h3>Media</h3>
    <v-row
      class="media-box"
      justify="start"
      no-gutters
    >
      <v-col
        v-for="(media, index) in medias"
        :key="`media-${index}`"
        cols="auto"
        class="genre-item"
      >
        <FilterTag :label="media" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import FilterTag from "./FilterTag.vue";
import type { Genre } from "@/types/index"

const genres: string[] = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Fantasy",
  "Documentary",
  "Adventure",
  "Mystery",
];

const medias: string[] =[
  "Tv",
  "Movie"
];
// const genreSelected: Genre[] = []
</script>


<style scoped>
.filter-box {
  background-color: var(--color-background-soft);
  margin-top: 50px;
  width: 430px;
  border-radius: 5px;
  height: auto;
  padding: 1rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  color: var(--color-text);
}

h3 {
  font-weight: bold;
  margin-bottom: 20px;
}

.genre-box {
  display: flex;
  flex-wrap: wrap;
}

.genre-item {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
