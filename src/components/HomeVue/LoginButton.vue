<template>
  <div>
    <!-- Login Button -->
    <v-btn class="custom-login-button mb-4" @click="showModal = true">Login</v-btn>

    <!-- Login Modal -->
    <v-dialog v-model="showModal" persistent max-width="400">
      <v-card>
        <v-btn icon class="close-button" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-title class="text-h4 font-weight-bold text-center logo">
          Nostromo
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="handleSubmit" class="login-form">
            <!-- Username Field -->
            <v-text-field
              v-model="form.username"
              label="Username"
              required
              outlined
            ></v-text-field>

            <!-- Password Field -->
            <v-text-field
              v-model="form.password"
              label="Password"
              type="password"
              required
              outlined
            ></v-text-field>

            <!-- Error Message -->
            <v-alert v-if="passwordError" type="error" dismissible class="mt-3">
              {{ passwordError }}
            </v-alert>

            <!-- Submit Button -->
            <v-btn
              type="submit"
              color="primary"
              class="submit-button mt-3"
              block
            >
              Log In
            </v-btn>
          </v-form>
          <div class="sign-up mt-4">
            <router-link
              class="nav-link"
              :class="{ active: $route.path === '/register' }"
              to="/register"
            >
              Create Profile
            </router-link>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "@/stores/authMethod";

const emit = defineEmits<{
  "login-success": [];
}>();

const router = useRouter();
const showModal = ref(false);
const passwordError = ref("");

const { form, login } = useLoginStore();

const handleSubmit = async () => {
  try {
    await login();
    emit("login-success");
    close();
  } catch (error) {
    passwordError.value = "Login failed. Please check your credentials.";
  }
};

const close = () => {
  showModal.value = false;
};
</script>

<style scoped>
.brand-name {
  font-size: 40px;
  font-weight: bold;
  text-align: center;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #333;
  cursor: pointer;
}

.sign-up {
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;
}

.custom-login-button {
  color: #333 !important; /* Override default text color */
  background-color: transparent !important; /* Remove background if needed */
  border: 1px solid #333; /* Optional: Add a border */
  text-transform: none; /* Optional: Disable uppercase */
}

.custom-login-button:hover {
  background-color: rgba(51, 51, 51, 0.1); /* Optional: Add hover effect */
}

.logo {
  font-family: "Nostromo3D", sans-serif;
  font-size: 2.5rem;
  color:rgb(0, 0, 0); 
  margin: 0;
  padding: 0;
  letter-spacing: 1px;
  line-height: 1;
}
</style>