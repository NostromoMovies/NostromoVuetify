<template>
  <div class="container">
    <!-- Watched Folders List -->
    <div class="folders-list">
      <h3>Watched Folders</h3>
      <div class="folders-container" v-if="folders.length > 0">
        <div v-for="(folder, index) in folders" 
             :key="index" 
             class="folder-item">
          <span class="folder-icon">📁</span>
          <span class="folder-path">{{ folder }}</span>
          <ConfirmDelete>🗑️</ConfirmDelete>
        </div>
      </div>
      <div v-else class="no-folders">
        No watched folders found
      </div>
    </div>

    <!-- Existing Button and Popup -->
    <div class="button-wrapper">
      <CreateFolderButton @toggle-popup="togglePopup"></CreateFolderButton>
    </div>
    <FolderCreationPopup 
      v-if="showPopup"
      :show="showPopup"
      @toggle-visibility="togglePopup"
    />
  </div>
</template>

<script setup lang="ts">
import CreateFolderButton from './CreateFolderButton.vue';
import FolderCreationPopup from './FolderCreationPopup.vue';
import ConfirmDelete from '../ConfirmDelete.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const showPopup = ref(false);
const folders = ref<string[]>([]);

const togglePopup = (value: boolean) => {
  console.log('togglePopup called with value:', value);
  console.log('Previous showPopup value:', showPopup.value); 
  showPopup.value = value;
  console.log('New showPopup value:', showPopup.value);
};

const fetchFolders = async () => {
  try {
    const response = await axios.get('http://localhost:8112/api/folders/get-all');
    folders.value = response.data;
  } catch (error) {
    console.error('Error fetching folders:', error);
    folders.value = [];
  }
};

const removeFolder = async (path: string) => {
  try {
    await axios.get('http://localhost:8112/api/folders/remove', {
      params: { path }
    });
    // Refresh the folders list after successful deletion
    await fetchFolders();
  } catch (error) {
    console.error('Error removing folder:', error);
  }
};

onMounted(() => {
  fetchFolders();
});
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