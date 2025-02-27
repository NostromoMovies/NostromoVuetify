<template>
  <div>
    <div v-if="show" class="popup-select-type">
      <div class="popup-content">
        <button class="close-button" @click="close">x</button>
        <h2 class="title">Select Type</h2>
        <v-radio-group v-model="selectedType" row>
          <v-radio label="Movie" :value="0"></v-radio>
          <v-radio label="TV" :value="1"></v-radio>
        </v-radio-group>
        <div class="button-group">
          <button class="cancel" @click="close">Cancel</button>
          <button class="select" :disabled="selectedType === null" @click="toggleFolderPopup">
            Next
          </button>
        </div>
      </div>
    </div>
    <div v-if="showFolderPopup" class="popup">
      <div class="popup-content">
        <button class="close-button" @click="closeFolderPopup">x</button>
        <h2 class="title">Select {{ selectedType === 0 ? 'Movie' : 'TV' }} Import Folder</h2>
        <div class="folder-browser">
          <FolderTree :items="folderStructure" :selected-folder="selectedFolder" @select="selectFolder" />
        </div>
        <div class="button-group">
          <button class="cancel" @click="closeFolderPopup">Cancel</button>
          <button class="select" :disabled="!selectedFolder" @click="submitSelectedFolder">
            Select
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import FolderTree from './FolderTree.vue';

interface FolderStructureItem {
  path: string;
  isExpanded: boolean;
  isLoading?: boolean;
  subfolders?: FolderStructureItem[];
}

const props = defineProps<{ show: boolean }>();
const emit = defineEmits<{ (event: "toggle-visibility", show: boolean): void }>();

const folderStructure = ref<FolderStructureItem[]>([]);
const selectedFolder = ref<string | null>(null);
const selectedType = ref<number>(0);
const showFolderPopup = ref<boolean>(false);
const router = useRouter();

const toggleFolderPopup = () => {
  close();
  showFolderPopup.value = !showFolderPopup.value;
};

const closeFolderPopup = () => {
  showFolderPopup.value = false;
};

const loadDrives = async () => {
  try {
    const response = await fetch('/api/folders/Drives');
    if (!response.ok) throw new Error('Failed to load drives');
    const result = await response.json();
    if (result && result.data && Array.isArray(result.data.items)) {
      folderStructure.value = result.data.items.map((drive: any) => ({
        path: drive.path,
        isExpanded: false,
        isLoading: false,
      }));
    } else {
      folderStructure.value = [];
    }
  } catch (error) {
    folderStructure.value = [];
  }
};

const selectFolder = (path: string) => {
  selectedFolder.value = path;
};

const submitSelectedFolder = async () => {
  if (!selectedFolder.value) return;
  try {
    const response = await fetch(
      `/api/folders/set?path=${encodeURIComponent(selectedFolder.value)}&type=${selectedType.value}`,
      {
        method: 'GET'
      }
    );
    
    if (!response.ok) throw new Error('Failed to set folder');

    close();
    router.replace({ path: router.currentRoute.value.path });
  } catch (error) {}
};

const close = () => {
  selectedFolder.value = null;
  emit("toggle-visibility", false);
};

onMounted(loadDrives);
</script>

<style scoped>
.popup-select-type {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1a1a1a;
  width: 400px;
  height: 300px;
  color: #fff;
  z-index: 1000;
  border-radius: 8px;
  display: flex;
}
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1a1a1a;
  width: 500px;
  height: 600px;
  color: #fff;
  z-index: 1000;
  border-radius: 8px;
  display: flex;
}
.popup-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}
.folder-browser {
  flex: 1;
  overflow-y: auto;
  background-color: #2a2a2a;
  border-radius: 4px;
  padding: 10px;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.cancel,
.select {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.cancel {
  background-color: transparent;
  color: #fff;
}
.select {
  background-color: var(--accent-secondary);
  color: #fff;
}
.select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>