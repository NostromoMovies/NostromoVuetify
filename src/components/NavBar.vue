<template>
  <v-app-bar color="primary" dark app>
    <!-- Logo -->
    <v-toolbar-title class="logo">Nostromo</v-toolbar-title>

    <!-- Navigation Links -->
    <v-btn
      v-if="isAuthenticated"
      text
      :class="{ 'v-btn--active': $route.path === '/dashboard' }"
      to="/dashboard"
    >
      Dashboard
    </v-btn>

    <v-btn
      v-if="isAuthenticated"
      text
      :class="{ 'v-btn--active': $route.path === '/collection' }"
      to="/collection"
    >
      Collection
    </v-btn>

    <!-- Spacer to push login/profile buttons to the right -->
    <v-spacer />

    <!-- Login and Profile Buttons -->
    <LoginButton
      v-if="!isAuthenticated"
      class="right-cushion"
      @login-success="handleLogin"
    />
    <ProfileButton
      v-else
      class="right-cushion"

    />
  </v-app-bar>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import LoginButton from "./HomeVue/LoginButton.vue";
import ProfileButton from "./ProfileButton.vue";
import { useAuthStore } from "@/services/authStore";

export default defineComponent({
  components: {
    LoginButton,
    ProfileButton,
  },
  setup() {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    const handleLogin = () => {
      console.log("User has logged in");
      window.location.reload();

    };

    // const handleLogout = () => {
    //   authStore.logout();
    //   window.location.reload();

    //   console.log("User has logged out");
    // };

    return { isAuthenticated, handleLogin };
  },
});
</script>

<style scoped>
.logo {
  font-family: "Nostromo3D", sans-serif;
  font-size: 2.5rem;
  color:rgb(65, 240, 11);
  margin: 0;
  padding: 0;
  letter-spacing: 1px;
  line-height: 1;
}

/* Add cushion (padding/margin) to Login/Profile buttons */
.right-cushion {
  margin-right: 20px; /* Adjust as needed */
}

/* Highlight active navigation links */
.v-btn--active {
  font-weight: bold;
  color: var(--accent-primary);
}

/* Responsive adjustments for smaller screens */
@media (max-width: 768px) {
  .logo {
    font-size: 1.5rem;
  }
}
</style>
