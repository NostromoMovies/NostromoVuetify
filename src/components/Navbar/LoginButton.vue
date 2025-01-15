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
              <h2 class="text-center mb-5">Nostromo</h2>
  
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
                label="Password"
                type="password"
                outlined
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
            <router-link :to="'/register'" class="text-decoration-none">
              <v-btn text color="primary">Create Profile</v-btn>
            </router-link>
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
  </style>
  