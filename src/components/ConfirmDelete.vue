<template>
  <v-container>
    <!-- Button to trigger confirmation dialog -->
    <v-btn @click="dialog = true" fab>
      <v-icon>🗑️</v-icon>
    </v-btn>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Are you sure you want to delete?</v-card-title>
    
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="red" text @click="deleteItem">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  setup() {
    // Reactive variables
    const dialog = ref(false); // Controls the visibility of the dialog
    const model = ref(''); // Stores the text input value
    const messages = ref('Modify my value'); // Placeholder message for the input field

    // Method to handle delete action
    const deleteItem = () => {
      console.log('Item deleted!');
      console.log('Input Value:', model.value);
      dialog.value = false; // Close the dialog
    };

    return {
      dialog,
      model,
      messages,
      deleteItem,
    };
  },
};
</script>

<style scoped>
 .v-card {
  background-color: #fff !important; /* Ensures the card has a white background */
}
/* Optional: Style the dialog to center on screen */
.v-dialog {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}
</style>
