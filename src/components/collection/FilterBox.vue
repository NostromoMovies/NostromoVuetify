<template>
  <div class="filter-box">
    <h3>Genre</h3>
    <v-row class="genre-box" justify="start" no-gutters>
      <v-col
        v-for="(genre, index) in genres"
        :key="`genre-${index}`"
        cols="auto"
        class="genre-item"
      >
        <FilterTag :label="genre" @click="toggleGenre(genre)" />
      </v-col>
    </v-row>

    <h3>Media</h3>
    <v-row class="media-box" justify="start" no-gutters>
      <v-col
        v-for="(media, index) in medias"
        :key="`media-${index}`"
        cols="auto"
        class="genre-item"
      >
        <FilterTag :label="media" @click="selectMedia(media)" />
      </v-col>
    </v-row>

    <h3>Years</h3>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model.number="startYear"
          label="Start Year"
          type="number"
          :min="minYear"
          :max="maxYear"
          @input="emitYears"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model.number="endYear"
          label="End Year"
          type="number"
          :min="startYear"
          :max="maxYear"
          @input="emitYears"
        ></v-text-field>
      </v-col>
    </v-row>

    <h3>Runtimes</h3>
    <v-row>
      <v-col>
        <v-slider
          v-model="runtime"
          :min="60"
          :max="180"
          step="30"
          thumb-label
          :ticks="[60, 90, 120, 150, 180]"  
          tick-size="4"
          @update:modelValue="emitRuntime"
        />


      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref, defineEmits } from "vue";
import FilterTag from "./FilterTag.vue";
import { getService } from "@/api/GetService";

// Emits setup
const emit = defineEmits(["genre-selected", "media-selected", "year-changed", "runtime-changed"]);

const genres = ref<string[]>([
  "Action", "Comedy", "Drama", "Horror", "Sci-Fi",
  "Romance", "Thriller", "Fantasy", "Documentary",
  "Adventure", "Mystery"
]);

const medias = ref<string[]>(["Tv", "Movie"]);

const selectedGenres = ref<string[]>([]);
const selectedMedia = ref<string | null>(null);
const startYear = ref<number | null>(null);
const endYear = ref<number | null>(null);
const minYear = ref<number | null>(null); 
const maxYear = new Date().getFullYear();
const runtime = ref<number>(180);

// Fetching years and setting the default values
const getYears = async (): Promise<number | null> => {
  try {
    const response = await getService.getYears();

    
    const year = response.data;

    
    minYear.value = year;
    startYear.value = minYear.value;
    endYear.value = maxYear;

    console.log(startYear);
    console.log(endYear);

    return minYear.value;  
  } catch (error) {
    console.error('Error fetching years:', error);
    return null;  
  }
}

// Emit selected genres
const toggleGenre = (genre: string) => {
  if (selectedGenres.value.includes(genre)) {
    selectedGenres.value = selectedGenres.value.filter(g => g !== genre);
  } else {
    selectedGenres.value.push(genre);
  }
  emit("genre-selected", selectedGenres.value);
};

// Emit selected media type
const selectMedia = (media: string) => {
  selectedMedia.value = media;
  emit("media-selected", selectedMedia.value);
};

// Emit year range
const emitYears = () => {
  emit("year-changed", [startYear.value, endYear.value]);
};

// Emit runtime changes
const emitRuntime = () => {
  emit("runtime-changed", runtime.value);
};


onMounted(async () => {
  await getYears();
  await emitRuntime();  
});
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
