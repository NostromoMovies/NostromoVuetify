<template>
  <div>
    <!-- Watchlists Display -->
    <v-list class="mt-4" style="max-height: 400px; overflow-y: auto;">
      <template v-if="watchlists.length">
        <v-list-item
          v-for="(watchlist, index) in watchlists"
          :key="index"
          class="my-2 py-3 px-4"
          style="
            border-radius: 12px;
            margin: 15px 0;
            border: 1px solid rgba(255, 255, 255, 0.12);
          "
          @click="goToWatchlist(watchlist.watchListID)"
>
          <v-list-item-icon>
            <v-icon>mdi-playlist-play</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ watchlist.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="ml-2">
            <v-btn 
              icon 
              color="error" 
              @click.stop="confirmDelete(watchlist)"
              small
            >
              <v-icon small>mdi-delete</v-icon>
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
      <v-btn color="primary" @click="dialog = true">
        Create Watchlist
      </v-btn>
    </div>

    <!-- Create Dialog -->
    <v-dialog v-model="dialog" max-width="500">
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

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card :theme="darkMode ? 'dark' : 'light'">
        <v-card-title class="dark-header">Confirm Delete</v-card-title>
        <v-card-text class="dark-body">
          Are you sure you want to delete "{{ watchlistToDelete?.name }}"?
        </v-card-text>
        <v-card-actions class="dark-actions">
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false" class="dark-cancel">Cancel</v-btn>
          <v-btn color="error" @click="deleteWatchlist" class="dark-confirm">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Watchlist {
  watchListID: number;
  name: string;
  userID: number;
}

// Dark mode
const darkMode = ref(true);

// State
const dialog = ref(false);
const deleteDialog = ref(false);
const watchlistName = ref('');
const watchlistToDelete = ref<Watchlist | null>(null);
const watchlists = ref<Watchlist[]>([]);


const goToWatchlist = (watchListID: number) => {
  router.push(`/watchlist/${watchListID}`);
};

// Delete confirmation
const confirmDelete = (watchlist: Watchlist) => {
  watchlistToDelete.value = watchlist;
  deleteDialog.value = true;
};

// Delete watchlist
const deleteWatchlist = async () => {
  try {
    if (!watchlistToDelete.value) return;
    ///api/WatchList/{watchListId}/delete
    const response = await fetch(`/api/WatchList/${watchlistToDelete.value.watchListID}/delete`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("apikey")}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error('Failed to delete watchlist');
    
    console.log("Watchlist deleted successfully");
    await loadWatchlists(); // Refresh 
    deleteDialog.value = false;
  } catch (error) {
    console.error("Error deleting watchlist:", error);
  }
};

// Load watchlists
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
   
    if (!watchlistName.value) {
      throw new Error('Watchlist name cannot be empty');
    }

    const response = await fetch("/api/watchlist/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("apikey")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(watchlistName.value)
    });

    if (!response.ok) {
      throw new Error('Failed to create watchlist');
    }

    console.log("Watchlist created successfully");
    await loadWatchlists();
    // emit('create', watchlistName.value);
    dialog.value = false;
    watchlistName.value = '';
  } catch (error) {
    console.error("Error creating watchlist:", error);

  }
};

onMounted(() => {
  loadWatchlists();
});
</script>

<style scoped>
.v-list-item {
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}
</style>