import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useNavigationStore = defineStore('navigation', () => {
  const router = useRouter();

  const navigateToUnrecognizedMovies = () => {
    router.push('/unrecognized-movies/matching'); // Ensure this matches the route in `router/index.ts`
  };

  return { navigateToUnrecognizedMovies };
});
