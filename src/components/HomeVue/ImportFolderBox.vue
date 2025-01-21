<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title>Watched Folders</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="(folder, index) in folders"
            :key="index"
          >
            <v-list-item-icon>
              <v-icon>mdi-folder</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ folder }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon color="error" @click="removeFolder(folder)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <div v-if="folders.length === 0" class="text-center text-secondary">
          No watched folders found.
        </div>
      </v-card-text>
    </v-card>
    <v-btn block color="primary" @click="togglePopup(true)">Add Folder</v-btn>
    <FolderCreationPopup
      :show="showPopup"
      @toggle-visibility="togglePopup"
    />
  </v-container>
</template>

<script setup lang="ts">
import FolderCreationPopup from './FolderCreationPopup.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const showPopup = ref(false);
const folders = ref<string[]>([]);

const togglePopup = (value: boolean) => {
  showPopup.value = value;
};

const fetchFolders = async () => {
  try {
    const response = await axios.get('/api/folders/get-all');
    folders.value = response.data;
  } catch (error) {
    console.error('Error fetching folders:', error);
  }
};

const removeFolder = async (path: string) => {
  try {
    await axios.get('/api/folders/remove', { params: { path } });
    fetchFolders();
  } catch (error) {
    console.error('Error removing folder:', error);
  }
};

onMounted(fetchFolders);
</script>


<style scoped>
.container {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.folders-list {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.folders-list h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--color-text);
}

.folders-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background-color: rgb(24, 24, 24);
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.folder-item:hover {
  background-color: #3a3a3a;
}

.folder-icon {
  font-size: 1.2rem;
}

.folder-path {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-button {
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
  color: inherit;
}

.delete-button:hover {
  opacity: 1;
  transform: scale(1.1);
}

.no-folders {
  text-align: center;
  padding: 20px;
  color: #666;
}

.button-wrapper {
  padding: 20px;
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}
</style>