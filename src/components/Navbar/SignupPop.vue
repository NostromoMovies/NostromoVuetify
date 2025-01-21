<template>
    <v-container class="d-flex justify-center align-center">
      <v-card class="pa-5" outlined>
        <v-card-title class="text-h4 font-weight-bold text-center logo">
          Nostromo
        </v-card-title>
        
        <v-alert v-if="message" type="error" dismissible>
          {{ message }}
        </v-alert>
  
        <v-form @submit.prevent="handleSubmit" ref="formRef">
          <v-text-field
            label="Username"
            v-model="form.username"
            placeholder="Enter your username"
            outlined
            dense
            required
          ></v-text-field>
  
          <v-text-field
            :type="passwordVisible ? 'text' : 'password'"
            label="Password"
            v-model="form.password"
            placeholder="Enter your password"
            outlined
            dense
            append-icon="mdi-eye"
            :append-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="togglePasswordVisibility"
            required
          ></v-text-field>
  
          <v-text-field
            :type="confirmPasswordVisible ? 'text' : 'password'"
            label="Re-Enter Password"
            v-model="checkPassword"
            placeholder="Re-Enter Password"
            outlined
            dense
            append-icon="mdi-eye"
            :append-icon="confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="toggleConfirmPasswordVisibility"
            required
          ></v-text-field>
  
          <v-alert v-if="passwordError" type="error" dense>
            {{ passwordError }}
          </v-alert>
  
          <v-btn
            class="mt-4"
            color="primary"
            block
            large
            type="submit"
          >
            Sign Up
          </v-btn>
        </v-form>
      </v-card>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useSignupStore } from "@/stores/signupMethod";
 
  
  export default defineComponent({
    name: "Signup",
    setup() {
      const router = useRouter();
      const { form, register, message } = useSignupStore();
  
      const checkPassword = ref("");
      const passwordVisible = ref(false);
      const confirmPasswordVisible = ref(false);
  
      const passwordError = computed(() => {
        return checkPassword.value && form.value.password !== checkPassword.value
          ? "Passwords do not match"
          : "";
      });
  
      const togglePasswordVisibility = () => {
        passwordVisible.value = !passwordVisible.value;
      };
  
      const toggleConfirmPasswordVisibility = () => {
        confirmPasswordVisible.value = !confirmPasswordVisible.value;
      };
  
      const handleSubmit = async () => {
        try {
          if (!passwordError.value) {
           const response =  await register();
           console.log('API response',response)
          }
        } catch (error) {
          console.error("Signup error:", error);
        }
      };
  
      return {
        form,
        checkPassword,
        passwordVisible,
        confirmPasswordVisible,
        passwordError,
        handleSubmit,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        message,
      };
    },
  });
  </script>
  

<style scoped>
.v-container {
  display: flex; /* Enables flexbox */
  justify-content: center; /* Centers horizontally */
  align-items: center; /* Centers vertically */
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  margin: 0; /* Removes any default margin */
}

.v-card {
  max-width: 400px; /* Ensure card doesn't stretch too wide */
  margin: auto; /* Center the card horizontally and vertically */
}

.v-text-field {
  margin-bottom: 16px; /* Uniform spacing */
  max-width: 400px; /* Consistent width for inputs */
  width: 100%; /* Stretch inputs to match card width */
}

  .v-text-field {
  margin-bottom: 16px; /* Uniform spacing */
  max-width: 400px; /* Optional: Ensure consistent width */
  width: 400px;
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
  