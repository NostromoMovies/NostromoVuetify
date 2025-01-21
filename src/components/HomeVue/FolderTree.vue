<template>
  <div class="folder-tree">
    <div
      v-for="item in items"
      :key="item.path"
      class="folder-item"
    >
      <div
        class="folder-row"
        :class="{ 'selected': selectedFolder === item.path }"
        @click.stop="toggleFolder(item)"
      >
        <span class="expand-icon" v-if="!item.isLoading">
          {{ item.isExpanded ? '▼' : '▶' }}
        </span>
        <span class="expand-icon" v-else>
          ⋯
        </span>
        {{ getDisplayName(item.path) }}
      </div>

      <div v-if="item.isExpanded" class="subfolder-container">
        <folder-tree
          v-if="item.subfolders"
          :items="item.subfolders"
          :selected-folder="selectedFolder"
          @select="$emit('select', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';

interface FolderAndFiles {
  files: number;
  folders: number;
}

interface FolderInfo {
  path: string;
  isAccessible: boolean;
  sizes: FolderAndFiles;
}

interface FolderStructureItem {
  path: string;
  isExpanded: boolean;
  isLoading?: boolean;
  subfolders?: FolderStructureItem[];
}

const props = defineProps({
  items: {
    type: Array as PropType<FolderStructureItem[]>,
    required: true
  },
  selectedFolder: {
    type: String as PropType<string | null>,
    default: null
  }
});

const emit = defineEmits<{
  (event: 'select', path: string): void
}>();

const loadSubfolders = async (path: string): Promise<FolderInfo[]> => {
  try {
    const response = await fetch(`/api/folders?path=${encodeURIComponent(path)}`);
    if (!response.ok) throw new Error('Failed to load subfolders');
    return await response.json();
  } catch (error) {
    console.error('Error loading subfolders:', error);
    return [];
  }
};

const toggleFolder = async (folder: FolderStructureItem) => {
  emit('select', folder.path);

  folder.isExpanded = !folder.isExpanded;
  if (!folder.isExpanded) return;

  folder.isLoading = true;
  try {
    const response = await fetch(`/api/folders?path=${encodeURIComponent(folder.path)}`);
    if (!response.ok) throw new Error("Failed to load subfolders");

    const result = await response.json();

    if (result && result.data && Array.isArray(result.data.items)) {
      folder.subfolders = result.data.items.map((subfolder: any) => ({
        path: subfolder.path,
        isExpanded: false,
        isLoading: false,
      }));
    } else {
      console.error("Unexpected response format:", result);
      folder.subfolders = [];
    }
  } catch (error) {
    console.error("Error loading subfolders:", error);
    folder.subfolders = [];
  } finally {
    folder.isLoading = false;
  }
};

const getDisplayName = (path: string) => {
  return path.split('/').pop() || path;
};
</script>

<style scoped>
.folder-tree {
  width: 100%;
}

.folder-item {
  margin: 2px 0;
}

.folder-row {
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.folder-row:hover {
  background-color: #3a3a3a;
}

.folder-row.selected {
  background-color: #4a4a4a;
}

.expand-icon {
  font-size: 0.8em;
  width: 20px;
}

.subfolder-container {
  margin-left: 20px;
}
</style>