<template>
  <v-dialog v-model="dialog" max-width="500">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary" class="ma-2">
        Create Collection
      </v-btn>
    </template>

    <v-card :theme="darkMode ? 'dark' : 'light'">
      <v-card-title class="dark-header">Create a Collection</v-card-title>

      <v-card-text class="dark-body">
        <v-text-field v-model="collectionName"
                      label="Collection Name"
                      outlined
                      required
                      dark
                      color="primary"
                      class="dark-input" />
      </v-card-text>

      <v-card-actions class="dark-actions">
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false" class="dark-cancel">Cancel</v-btn>
        <v-btn color="primary" @click="createCollection" class="dark-confirm">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="showSuccessSnackbar" color="success" timeout="3000">
    Collection created successfully!
  </v-snackbar>
</template>

<script setup>import { ref, watch } from 'vue';
  import { getService } from '@/api/GetService';

  const darkMode = ref(true);

  const props = defineProps({
    modelValue: Boolean,
    initialName: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:modelValue', 'create']);

  const dialog = ref(props.modelValue);
  const collectionName = ref(props.initialName);
  const showSuccessSnackbar = ref(false);

  watch(() => props.modelValue, (val) => {
    dialog.value = val;
  });

  watch(dialog, (val) => {
    emit('update:modelValue', val);
  });

  const formatCollectionName = (name) => {
    return String(name || '').trim();
  };

  const createCollection = async () => {
    try {
      const formattedName = formatCollectionName(collectionName.value);
      if (!formattedName) {
        throw new Error('Collection name cannot be empty');
      }

      await getService.createCollection(formattedName);

      console.log("Collection created successfully");
      showSuccessSnackbar.value = true;
      emit('create', formattedName);
      dialog.value = false;
      collectionName.value = ''; // Reset
    } catch (error) {
      console.error("Error creating collection:", error.response?.data || error.message);
      alert(error.response?.data || error.message);
    }
  };</script>
