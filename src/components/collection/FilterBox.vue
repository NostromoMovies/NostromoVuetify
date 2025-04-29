<script setup lang="ts">
import { onMounted, ref } from "vue";
import FilterTag from "./FilterTag.vue";
import { getService } from "@/api/GetService";

// Emits setup
const emit = defineEmits(["genre-selected", "media-selected", "year-changed", "runtime-changed"]);

const genres = ref<{ genreID: number; name: string }[]>([]);
const medias = ref<string[]>(["Tv", "Movie"]);
const selectedGenres = ref<number[]>([]);
// Default both media types selected
const selectedMedia = ref<string[]>(['tv', 'movie']); 
const startYear = ref<number | null>(null);
const endYear = ref<number | null>(null);
const minYear = ref<number | null>(null); 
const maxYear = new Date().getFullYear();
const runtime = ref<number>(180);

// Fetch years and set default values
const getYears = async (): Promise<number | null> => {
  try {
    const response = await getService.getYears();
    const year = response.data;
    minYear.value = year;
    startYear.value = minYear.value;
    endYear.value = maxYear;
    return minYear.value;  
  } catch (error) {
    console.error('Error fetching years:', error);
    return null;  
  }
}

const getGenre = async () => {
  try {
    const response = await getService.getGenre();
    console.log("Genre API Response:", response.data);

    if (Array.isArray(response.data)) {
      genres.value = response.data.map(genre => ({
        genreID: genre.genreID,
        name: genre.name
      }));
    } else {
      console.error("Unexpected response format:", response.data);
      genres.value = [];
    }
  } catch (error) {
    console.error("Error fetching genres:", error);
    genres.value = [];
  }
};

// Emit selected genres
const toggleGenre = (payload: { id: number; selected: boolean }) => {
  if (payload.selected) {
    if (!selectedGenres.value.includes(payload.id)) {
      selectedGenres.value.push(payload.id);
    }
  } else {
    selectedGenres.value = selectedGenres.value.filter(g => g !== payload.id);
  }
  emit("genre-selected", selectedGenres.value);
};

// Emit selected media type
const toggleMedia = (payload: { id: string; selected: boolean }) => {
  if (payload.selected) {
    if (!selectedMedia.value.includes(payload.id)) {
      selectedMedia.value.push(payload.id);
    }
  } else {
    selectedMedia.value = selectedMedia.value.filter(m => m !== payload.id);
  }
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
  getGenre();
  // Emit initial media selection
  emit("media-selected", selectedMedia.value);
});
</script>

<template>
  <div class="filter-box">
    <h3>Genre</h3>
    <v-row class="genre-box" justify="start" no-gutters>
      <v-col v-for="(genre, index) in genres"
             :key="`genre-${index}`"
             cols="auto"
             class="genre-item">
        <FilterTag :label="genre.name" :id="genre.genreID" @toggle="toggleGenre" />
      </v-col>
    </v-row>

    <h3>Media</h3>
    <v-row class="media-box" justify="start" no-gutters>
      <v-col v-for="(media, index) in medias"
             :key="`media-${index}`"
             cols="auto"
             class="genre-item">
        <FilterTag 
          :label="media" 
          :id="media.toLowerCase()" 
          @toggle="toggleMedia" 
          :selected="selectedMedia.includes(media.toLowerCase())" 
        />
      </v-col>
    </v-row>

    <!-- Rest of your template remains the same -->
    <h3>Years</h3>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model.number="startYear"
                      label="Start Year"
                      type="number"
                      :min="minYear"
                      :max="maxYear"
                      @input="emitYears"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model.number="endYear"
                      label="End Year"
                      type="number"
                      :min="startYear"
                      :max="maxYear"
                      @input="emitYears"></v-text-field>
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

<style scoped>
.filter-box {
  background-color: rgb(34,34,34);
  margin-top: 50px;
  width: 430px;
  border-radius: 5px;
  height: auto;
  padding: 1rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  color: rgb(135, 206, 250);
}

h3 {
  font-weight: bold;
  margin-bottom: 20px;
}

.genre-box, .media-box {
  display: flex;
  flex-wrap: wrap;
}

.genre-item {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>