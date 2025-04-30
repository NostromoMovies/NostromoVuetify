<template>
  <v-menu v-model="isDropdownVisible">
    <!-- Activator: Button -->
    <template #activator="{ props }">
      <v-btn v-bind="props" icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>

    <!-- Dropdown Menu -->
    <v-theme-provider :theme="darkMode ? 'dark' : 'light'">
    <v-list >
      <v-list-item @click="goToSettings">
        <v-list-item-title>Settings</v-list-item-title>
      </v-list-item>
      <v-list-item @click="profilePage">
        <v-list-item-title>Profiles</v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
    </v-theme-provider>
  </v-menu>

</template>

<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/services/authStore";

export default {
  setup() {
    const isDropdownVisible = ref(false);
    const darkMode = ref(true); // ✅ You need this

    const router = useRouter();
    const authStore = useAuthStore();

    const goToSettings = () => {
      console.log("Navigating to Settings...");
      router.push("/settings");
    };

    const logout = () => {
      console.log("Logging out...");
      authStore.logout();
      router.push("/");
      window.location.reload();
    };

    const profilePage = () => {
      console.log("Navigating to Profiles...");
      router.push("/profiles");
    };

    return {
      isDropdownVisible,
      darkMode,
      goToSettings,
      logout,
      profilePage
    };
  },
};
</script>


