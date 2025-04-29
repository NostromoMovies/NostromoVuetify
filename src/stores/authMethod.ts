import { ref, onMounted } from 'vue';
import type { LoginForm } from '@/types/index';
import { useRouter } from 'vue-router';
import { authService } from '@/api/AuthService';
import { useAuthStore } from '@/stores/authStore';

export const useLoginStore = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const form = ref<LoginForm>({
    username: '',
    password: '',
    device: navigator.userAgent
  });

  const message = ref<string>('');
  const user = ref(null);

  onMounted(() => {
    if (authStore.isAuthenticated) {
      console.log('Token found in auth store:', authStore.apikey);
    } else {
      console.log('No token found in auth store.');
    }
  });

  const login = async () => {
    try {
      const response = await authService.login(form.value);
      const token = response.data.data?.token;

      if (!token) {
        console.error("No token in response.data:", response.data);
        message.value = 'Login failed. No token returned.';
        return;
      }

      authStore.setApiKey(token);
      console.log("Token stored in authStore and localStorage:", token);

      message.value = 'Login successful!';
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Login error:', error);

      if (error instanceof Error) {
        message.value = error.message || 'Login failed, please try again.';
      } else {
        message.value = 'An unknown error occurred.';
      }
    }
  };

  const logout = () => {
    authStore.logout();
    router.push('/register');
  };

  return {
    form,
    login,
    logout,
    user,
    message
  };
};
