import { ref } from 'vue';
import type { Router } from 'vue-router'; // Use 'type' import for the Router type
import type { SignupForm } from '@/types';
import { authService } from '@/api/AuthService';


export const useSignupStore = (router: Router) => {
 const form = ref<SignupForm>({
   username: '',
   password: '',
   isAdmin: true,
 });


 const message = ref<string>('');


 const register = async () => {
   try {
     const response = await authService.register(form.value);

     console.log(response.status)
     if (response.status === 201) {
       const result = response.data;


       console.log('Account registered successfully:', result);


       message.value = 'Registration successful!';
     } else {
       throw new Error('Registration failed');
     }
   } catch (error: unknown) {
     console.error('Registration error:', error);


     if (error instanceof Error) {
       message.value = error.message || 'Registration failed, please try again.';
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





