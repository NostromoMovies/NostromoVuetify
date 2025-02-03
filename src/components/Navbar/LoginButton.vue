<template>
    <div>
      <!-- Login Button to Open Modal -->
      <v-btn class="ma-2" color="primary" @click="showModal = true">
        Login
      </v-btn>

      <!-- Login Dialog -->
      <v-dialog v-model="showModal" max-width="500">
        <v-card>
          <!-- Close Button -->
          <v-card-title class="justify-end">
            <v-btn icon @click="closeModal">
              <v-icon>x</v-icon>
            </v-btn>
          </v-card-title>

          <!-- Login Form -->
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
                      <v-card-title class="text-h4 font-weight-bold text-center logo">
          Nostromo
        </v-card-title>

              <!-- Username Input -->
              <v-text-field
                v-model="form.username"
                label="Username"
                outlined
                required
              ></v-text-field>

              <!-- Password Input -->
              <v-text-field
                  v-model="form.password"
                  :type="passwordVisible ? 'text' : 'password'"
                  label="Password"
                  outlined
                  dense
                  placeholder="Enter your password"
                  :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="togglePasswordVisibility"
                  required
              ></v-text-field>

              <!-- Error Alert -->
              <v-alert v-if="passwordError" type="error" dense>
                {{ passwordError }}
              </v-alert>

              <!-- Submit Button -->
              <v-btn type="submit" color="primary" block class="mt-4">
                Log In
              </v-btn>
            </v-form>
          </v-card-text>

          <!-- Register Link -->
          <v-card-actions class="justify-center">
            <v-btn
              to="/register"
              variant="text"
              color="primary"
              class="text-decoration-none"
            >
              Create Profile
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useLoginStore } from '@/stores/authMethod';

  const showModal = ref(false); // Modal visibility
  const passwordError = ref(''); // Error message
  const { form, login } = useLoginStore(); // Login store
  const router = useRouter(); // Router instance
  const passwordVisible = ref(false);
  const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

  const handleLogin = async () => {
    try {
      await login();
      closeModal(); // Close modal on successful login
    } catch {
      passwordError.value = 'Login failed. Please check your credentials.';
    }
  };

  const closeModal = () => {
    showModal.value = false; // Close modal function
  };
  </script>

  <style scoped>
  .v-card {
  background-color: #fff !important; /* Ensures the card has a white background */
}

  .text-center {
    text-align: center;
  }

  .mb-5 {
    margin-bottom: 1.25rem;
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
