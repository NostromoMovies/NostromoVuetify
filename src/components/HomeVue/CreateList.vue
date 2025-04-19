<template>
  <v-dialog v-model="dialog" max-width="500">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary" class="ma-2">
        Create Watchlist
      </v-btn>
    </template>

    <v-card :theme="darkMode ? 'dark' : 'light'">
      <v-card-title class="dark-header">Create a Watchlist</v-card-title>

      <v-card-text class="dark-body">
        <v-text-field
          v-model="watchlistName"
          label="Watchlist Name"
          outlined
          required
          dark
          color="primary"
          class="dark-input"
        />
      </v-card-text>

      <v-card-actions class="dark-actions">
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false" class="dark-cancel">Cancel</v-btn>
        <v-btn color="primary" @click="createWatchlist" class="dark-confirm">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getService } from '@/api/GetService';

// Dark mode (can be static or injected from a store/context)
const darkMode = ref(true);

// Props definition
const props = defineProps({
  modelValue: Boolean,
  initialName: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'create']);

const dialog = ref(props.modelValue);
const watchlistName = ref(props.initialName);

// Sync dialog with parent v-model
watch(() => props.modelValue, (val) => {
  dialog.value = val;
});

watch(dialog, (val) => {
  emit('update:modelValue', val);
});

// Format and validate watchlist name
const formatWatchlistName = (name) => {
  return String(name || '').trim();
};

// Create watchlist handler
const createWatchlist = async () => {
  try {
    const formattedName = formatWatchlistName(watchlistName.value);
    if (!formattedName) {
      throw new Error('Watchlist name cannot be empty');
    }

    const response = await getService.createWatchList(formattedName);

    if (!response.ok) {
      throw new Error('Failed to create watchlist');
    }

    console.log("Watchlist created successfully");
    emit('create', formattedName);
    dialog.value = false;
    watchlistName.value = ''; // Reset
  } catch (error) {
    console.error("Error creating watchlist:", error);
    alert(error.message);
  }
};
</script>
