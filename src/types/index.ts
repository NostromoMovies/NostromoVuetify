// src/types/index.ts

import type { Ref } from "vue";

export interface Movie {
  movieID: number;
  title: string;
  posterPath?: string | null;
  overview?: string | null;
  releaseDate?: string | null;
  runtime?: number | string | null;
  backdropPath?: string | null;
  order: number;
}

export interface TvShow{
  showID: number;
  name: string;
  posterPath?: string | null;
  overview?: string | null;
  backdropPath?: string | null;
  order: number;
  voteAverage: number;
  voteCount: number
}

export interface Season{
  seasonID: number;
  showID: number;
  episodeCount: number;
  Overview?: string | null;
  posterPath?: string | null;
  voteAverage: number;
  seasonNumber: number;
  seasonName: string
}

export interface Episode{
  episodeID: number;
  seasonID: number;
  seasonNumber: number;
  episodeName: string;
  episodeNumber: string;
  overview?: string | null;
  runtime: number;
  voteAverage: number;
  voteCount: number;
  stillPath?: string | null;
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


export interface MovieStore {
  filterMovies: Ref<Movie[]>;
  movies: Ref<Movie[]>;
  lastFetched: Ref<number | null>;
  fetchMovies: (force?: boolean) => Promise<Movie[]>;
  getMovieById: (id: string | number) => Movie | null;
  getMovieRecommendation: (id: string | number) => Promise<Movie[]>;
  fetchFilterMovies: (
    force?: boolean,
    query?: string,
    runtime?: number | null,
    searchTermTerm?: number | null,
    minYear?: number | null,
    maxYear?: number | null
  ) => Promise<Movie[]>;
}

export interface TvShowStore{
  shows: Ref<TvShow[]>;
  fetchTvShows: (force?: boolean) => Promise<Movie[]>;
  getTvShowById: (id: number) => TvShow | null;
  lastFetched: Ref<number | null>;
}
