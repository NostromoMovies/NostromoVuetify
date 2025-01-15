<template>
  <div>
    <div class="button" @click="showModal = true">
      Login
    </div>
    <transition name="fade" appear>
      <div v-if="showModal" class="popup">
        <div class="popup-content">
          <button class="close-button" @click="close">x</button>
          <form @submit.prevent="handleSubmit" class="login-form">
            <p class="brand-name">Nostromo</p>
            <label>Username:</label>
            <input type="text" id="username" required v-model="form.username" />
            <label>Password:</label>
            <input type="password" id="password" required v-model="form.password" />
            <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
            <button type="submit" class="submit-button">Log In</button>
          </form>
          <div class="sign-up">
            <router-link class="nav-link" :class="{ active: $route.path === '/register' }" to="/register">
              Create Profile
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/authMethod';

const emit = defineEmits<{
    'login-success': [] 
  }>();


const router = useRouter();
const showModal = ref(false);
const passwordError = ref('');

const { form, login } = useLoginStore();

const handleSubmit = async () => {
  try {
    await login();
    emit('login-success')
  } catch (error) {
    passwordError.value = 'Login failed. Please check your credentials.';
  }
};

const close = () => {
  showModal.value = false;
};
</script>


<style scoped>
/* Styling for the Login Button */
.button {
  justify-content: center;
  align-items: center;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  display: inline-block;
  border-radius: 8px;
  color: #333;
  font-size: 18px;
  font-weight: 700;
  transition: 0.4s ease-out;
}

.button:hover {
  box-shadow: 6px 6px rgba(0, 0, 0, 0.6);
}

/* Styling for the Login Popup */
.popup {
  font-family: Arial, Helvetica, sans-serif;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 400px;
  height: 600px;
  color: #555;
  z-index: 1000;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
}

.brand-name {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
}

.popup-content {
  text-align: center;
  position: relative;
  width: 100%;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #333;
  font-size: 1.2rem;
  cursor: pointer;
}

form {
  max-width: 400px;
  max-height: 600px;
  margin: 0 auto;
  text-align: left;
  padding: 30px;
  border-radius: 10px;
}

label {
  color: #aaa;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

input {
  display: block;
  padding: 10px 6px;
  width: 100%;
  border-radius: 10px;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}

.submit-button {
  cursor: pointer;
  border: none;
  border-radius: 10px;
  margin: 20px auto;
  width: 100%;
  height: 50px;
}

.reset-password {
  font-size: 12px;
  text-align: center;
}

.sign-up {
  margin: 10px;
  background: none;
  border: none;
  color: #555;
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
  font: inherit;
}
</style>
