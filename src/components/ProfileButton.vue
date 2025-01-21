<template>
  <v-menu v-model="isDropdownVisible">
    <!-- Activator: Button -->
    <template #activator="{ props }">
      <v-btn v-bind="props" icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>

    <!-- Dropdown Menu -->
    <v-list>
      <v-list-item @click="goToSettings">
        <v-list-item-title>Settings</v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router"; // Import the Vue Router
import { useAuthStore } from "@/services/authStore"; // Import the auth store

export default {
  setup() {
    const isDropdownVisible = ref(false);
    const router = useRouter(); // Access the Vue Router
    const authStore = useAuthStore(); // Access the authentication store

    const goToSettings = () => {
      console.log("Navigating to Settings...");
      router.push("/settings"); // Navigate to the settings page
    };

    const logout = () => {
      console.log("Logging out...");
      authStore.logout(); // Call the logout method from the auth store
      router.push("/"); // Redirect to the login or home page
    };

    return {
      isDropdownVisible,
      goToSettings,
      logout,
    };
  },
};
</script>
