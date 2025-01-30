import { ref, onMounted } from 'vue';
import type { Genre } from '@/types/index';
import { useRouter } from 'vue-router';





export const genreFiltering = () => {
  const router = useRouter();

  const form = ref<Genre>({
    id: 1,
    genre: '',
  });

  // List of genres
  const genres = ref<string[]>([
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Thriller',
    'Adventure',
    'Documentary',
  ]);


  onMounted(() => {

  });





  return {
    form,
    genres


  };
};
