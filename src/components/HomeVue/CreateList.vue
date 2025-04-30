<template>
  <div>
    <!-- Watchlists Display -->
    <v-list class="mt-4 dark-list" style="max-height: 400px; overflow-y: auto;" theme="dark">
      <template v-if="watchlists.length">
        <v-list-item
          v-for="(watchlist, index) in watchlists"
          :key="index"
          class="my-2 py-3 px-4 dark-item"
          @click="goToWatchlist(watchlist.watchListID)"
        >
          <v-list-item-icon>
            <v-icon color="primary">mdi-playlist-play</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-white">{{ watchlist.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="ml-2">
            <v-btn
              icon
              color="error"
              @click.stop="confirmDelete(watchlist)"
              size="small"
            >
              <v-icon size="small">mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>

      <template v-else>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-grey">No watchlists</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>

    <!-- Create Watchlist Button -->
    <div class="d-flex justify-center mt-4">
      <v-btn color="primary" @click="dialog = true" variant="flat">
        Create Watchlist
      </v-btn>
    </div>

    <!-- Create Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card theme="dark">
        <v-card-title class="dark-header">Create a Watchlist</v-card-title>

        <v-card-text class="dark-body">
          <v-text-field
            v-model="watchlistName"
            label="Watchlist Name"
            variant="outlined"
            color="primary"
          />
        </v-card-text>

        <v-card-actions class="dark-actions">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="createWatchlist">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card theme="dark">
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ watchlistToDelete?.name }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="deleteWatchlist">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="success"
      timeout="3000"
      location="top"
    >
      Watchlist created successfully!
      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccessSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Watchlist {
  watchListID: number;
  name: string;
  userID: number;
}

const dialog = ref(false);
const deleteDialog = ref(false);
const watchlistName = ref('');
const watchlistToDelete = ref<Watchlist | null>(null);
const watchlists = ref<Watchlist[]>([]);
const showSuccessSnackbar = ref(false);

const goToWatchlist = (watchListID: number) => {
  router.push(`/watchlist/${watchListID}`);
};

const confirmDelete = (watchlist: Watchlist) => {
  watchlistToDelete.value = watchlist;
  deleteDialog.value = true;
};

const deleteWatchlist = async () => {
  try {
    if (!watchlistToDelete.value) return;
    const response = await fetch(`/api/WatchList/${watchlistToDelete.value.watchListID}/delete`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("apikey")}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error('Failed to delete watchlist');

    await loadWatchlists();
    deleteDialog.value = false;
  } catch (error) {
    console.error("Error deleting watchlist:", error);
  }
};

const loadWatchlists = async () => {
  try {
    const response = await fetch("/api/watchlist/all", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("apikey")}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error('Failed to fetch watchlists');
    watchlists.value = await response.json();
  } catch (error) {
    console.error("Error loading watchlists:", error);
  }
};

const createWatchlist = async () => {
  try {
    if (!watchlistName.value) throw new Error('Watchlist name cannot be empty');

    const response = await fetch("/api/watchlist/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("apikey")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(watchlistName.value)
    });

    if (!response.ok) throw new Error('Failed to create watchlist');

    await loadWatchlists();
    dialog.value = false;
    watchlistName.value = '';
    showSuccessSnackbar.value = true;
  } catch (error) {
    console.error("Error creating watchlist:", error);
  }
};

onMounted(() => {
  loadWatchlists();
});
</script>

<style scoped>
.dark-list {
  background-color: #121212;
}

.dark-item {
  border-radius: 12px;
  margin: 15px 0;
  border: 1px solid #333;
  background-color: #1e1e1e;
  transition: all 0.3s ease;
}

.dark-item:hover {
  background-color: #2a2a2a;
  transform: translateY(-2px);
}

.dark-header {
  background-color: #1e1e1e;
  color: #fff;
}

.dark-body {
  background-color: #121212;
  color: #fff;
}

.dark-actions {
  background-color: #1e1e1e;
}

.v-list-item-title {
  color: #fff;
}
</style>
