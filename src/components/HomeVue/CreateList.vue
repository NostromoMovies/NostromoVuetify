<template>
  <v-dialog v-model="dialog" max-width="500">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary" class="ma-2">
        Create Watchlist
      </v-btn>
    </template>

    <v-card dark>
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
import { ref } from 'vue';

const dialog = ref(false);
const watchlistName = ref('');
</script>

<style scoped>
/* Dark mode colors */
.v-card.dark {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

.dark-header {
  background-color: #121212;
  color: #ffffff;
  padding: 16px;
  border-bottom: 1px solid #333;
}

.dark-body {
  background-color: #1e1e1e;
  padding: 16px;
}

.dark-input {
  background-color: #2d2d2d;
}

.dark-input :deep(.v-input__control) {
  color: #ffffff;
}

.dark-input :deep(.v-label) {
  color: #9e9e9e !important;
}

.dark-input :deep(.v-input__slot) {
  background-color: #2d2d2d !important;
  border-color: #444 !important;
}

.dark-actions {
  background-color: #121212;
  padding: 8px 16px;
  border-top: 1px solid #333;
}

.dark-cancel {
  color: #9e9e9e !important;
}

.dark-cancel:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

.dark-confirm {
  color: #ffffff !important;
  background-color: #1976d2 !important;
}

.dark-confirm:hover {
  background-color: #1565c0 !important;
}
</style>