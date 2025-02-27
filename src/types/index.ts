// src/types/index.ts

import type { Ref } from "vue";

export interface Movie {
  movieID: number | string;
  title: string;
  posterPath?: string | null;
  overview?: string | null;
  releaseDate?: string | null;
  runtime?: number | string | null;
  backdropPath?: string | null;
}

export interface MovieStore {
  movies: Ref<Movie[]>;
  lastFetched: Ref<number | null>;
  fetchMovies: (force?: boolean) => Promise<Movie[]>;
  getMovieById?: (id: string | number) => Movie | null;
}

export interface LoginForm {
  username: string;
  password: string;
  device: string;
}

export interface SignupForm {
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface FileForm {
  file_name: string;
  file_location: string;
}

export interface Genre {
  id: number;
  genre: string;
}

export interface CastMember {
  id: number | string;
  name: string;
  originalName?: string | null;
  character?: string | null;
  creditId?: string | null;
  gender?: number | null;
  knownForDepartment?: string | null;
  order?: number | null;
  popularity?: number | null;
  profilePath?: string | null;
  adult?: boolean | null;
}

export interface CrewMember {
  id: number | null;
  name: string | null;
  originalName: string | null;
  creditId: string | null;
  gender: number | null;
  knownForDepartment: string | null;
  popularity: number | null;
  profilePath: string | null;
  adult: boolean | null;
  department: string | null;
  job: string | null;
}
