<template>
    <div>
      <v-menu
        v-model="isDropdownVisible"
        offset-y
        close-on-content-click
      >
      <template #activator="{ props }">
      <v-btn
        icon
        v-bind="props"
        color="accent-tertiary"
        class="dropdown-button"
      >
    <v-icon>mdi-account-circle</v-icon>
  </v-btn>
</template>
  
        <v-list>
          <v-list-item @click="goToSettings">
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, defineComponent } from "vue";
  import router from "@/router";
  import { useAuthStore } from "@/stores/authStore";
  
  export default defineComponent({
    setup(_, { emit }) {
      const authStore = useAuthStore();
      const isDropdownVisible = ref(false);
  
      const goToSettings = () => {
        console.log("Navigating to Settings...");
        router.push("/settings");
      };
  
      const logout = () => {
        authStore.logout();
        router.push("/");
        emit("loggedOut");
      };
  
      return {
        isDropdownVisible,
        goToSettings,
        logout,
      };
    },
  });
  </script>
  
  <style scoped>
  .dropdown-button {
    margin-right: 15px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
  
  .dropdown-button:hover {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }
  </style>
  