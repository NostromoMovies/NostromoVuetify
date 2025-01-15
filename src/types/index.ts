// src/types/index.ts

import type { Ref } from 'vue'

export interface Movie {
  movieID: number;
  title: string;
  posterUrl?: string;
}

export interface MovieStore {
  movies: Ref<Movie[]>;
  lastFetched: Ref<number | null>;
  fetchMovies: (force?: boolean) => Promise<Movie[]>;
}

export interface LoginForm {
  username: string;
  password: string;
  device: string;
}

export interface SignupForm  {
  username: string;
  password: string;
  
}

export interface FileForm {
  file_name: string;
  file_location: string;
}