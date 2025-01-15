import { ref } from 'vue';
import type { SignupForm } from '@/types/index';
import { useRouter } from 'vue-router'; // Import `useRouter` for dynamic routing
import { postService } from '@/api/AuthService';

export const useSignupStore = () => {
  // Reactive form data
  const form = ref<SignupForm>({
    username: '',
    password: '',
    isAdmin: true
  });

  // Reactive message for feedback
  const message = ref<string>('');

  // Router instance
  const router = useRouter();

  // Register function
  const register = async () => {
    try {
     
      const response = await postService.register(form.value);
  
      if (response.status === 200) {
        const result = response.data;
  
        console.log('Account registered successfully:', result);
  
        // Set success message and navigate to the dashboard
        message.value = 'Registration successful!';
        router.push('/dashboard');
      } else {
        // Handle non-successful responses
        throw new Error('Registration failed');
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
  
      // Extract the error message properly
      if (error instanceof Error) {
        message.value = error.message || 'Registration failed, please try again.';
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        // Handle Axios-like error 
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        message.value = axiosError.response?.data?.message || `Error: ${axiosError.response?.status || 'Unknown'}`;
      } else {
        message.value = 'An unknown error occurred.';
      }
    }
  };
  


  return {
    form,
    register,
    message,
  };
};
