

<template>
  <v-container class="d-flex justify-center align-center">
    <v-dialog v-model="showModal" persistent max-width="400">
      <v-card color="rgb(54, 54, 54)">
        <v-btn icon class="close-button" @click="emitClose" color="rgb(34, 34, 34)">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>

        <v-card-title class="text-h4 font-weight-bold text-center logo">
          Nostromo
        </v-card-title>

        <v-card-text>
          <v-alert v-if="message" type="error" dismissible>
            {{ message }}
          </v-alert>

          <v-form @submit.prevent="handleSubmit">
            <v-text-field label="Username"
                          v-model="form.username"
                          placeholder="Enter your username"
                          class="entry-font"
                          outlined
                          required></v-text-field>

            <v-text-field :type="passwordVisible ? 'text' : 'password'"
                          label="Password"
                          v-model="form.password"
                          placeholder="Enter your password"
                          class="entry-font"
                          outlined
                          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                          @click:append-inner="togglePasswordVisibility"
                          required></v-text-field>

            <v-text-field :type="confirmPasswordVisible ? 'text' : 'password'"
                          label="Re-Enter Password"
                          v-model="checkPassword"
                          placeholder="Re-Enter Password"
                          class="entry-font"
                          outlined
                          :append-inner-icon="confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                          @click:append-inner="toggleConfirmPasswordVisibility"
                          required></v-text-field>

            <!-- Content Rating Checkboxes -->
            <div class="mt-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="entry-font">Content Ratings</span>
                <v-btn 
                  size="x-small" 
                  variant="text" 
                  @click="toggleAllRatings"
                  class="entry-font"
                  color="grey lighten-1">
                  {{ allRatingsSelected ? 'Deselect All' : 'Select All' }}
                </v-btn>
              </div>
              
              <v-checkbox
                v-model="form.contentRatings"
                label="G - General Audience"
                value="G"
                color="green"
                hide-details
                density="compact"
              ></v-checkbox>
              
              <v-checkbox
                v-model="form.contentRatings"
                label="PG - Parental Guidance"
                value="PG"
                color="blue"
                hide-details
                density="compact"
              ></v-checkbox>
              
              <v-checkbox
                v-model="form.contentRatings"
                label="PG-13 - Teens and Above"
                value="PG13"
                color="orange"
                hide-details
                density="compact"
              ></v-checkbox>
              
              <v-checkbox
                v-model="form.contentRatings"
                label="R - Restricted (Adults Only)"
                value="R"
                color="red"
                hide-details
                density="compact"
              ></v-checkbox>
            </div>

            <v-alert v-if="passwordError" type="error" dense>
              {{ passwordError }}
            </v-alert>

            <v-btn class="entry-font compact-button"
                   color="rgb(34,34,34)"
                   block
                   type="submit">
              Sign Up
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useSignupStore } from "@/stores/signupMethod";

  export default defineComponent({
    name: "SignupPop",
    emits: ["close-signup"],
    setup(_, { emit }) {
      const router = useRouter();
      const { form, register, message } = useSignupStore(router);

      const showModal = ref(true);
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

      const emitClose = () => {
        showModal.value = false;
        emit("close-signup");
      };

      const handleSubmit = async () => {
        try {
          if (!passwordError.value) {
            await register();
            emitClose();
          }
        } catch (error) {
          console.error("Signup error:", error);
        }
      };

      return {
        form,
        showModal,
        checkPassword,
        passwordVisible,
        confirmPasswordVisible,
        passwordError,
        handleSubmit,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        message,
        emitClose,
      };
    },
  });
</script>

<style scoped>
  .v-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  .logo {
    font-family: "Nostromo3D", sans-serif;
    font-size: 2.5rem;
    color: rgb(65, 240, 11);
    margin: 0;
    padding: 10px;
    letter-spacing: 1px;
    line-height: 1;
  }

  .entry-font {
    font-family: "Open Sans" !important;
  }

  .v-text-field {
    margin-bottom: 16px;
    width: 100%;
    max-width: 400px;
  }
</style>
