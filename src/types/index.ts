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

export interface Tv {
  tvShowID: number;
  originalName: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  overview?: string | null;
  firstAirDate?: string | null;
  order: number;
}

export interface Season{
  seasonID: number;
  tvShowID: number;
  seasonNumber: number;
  overview?: string | null;
  posterPath?: string | null;
  episodeCount?: number | 0;
  seasonName?: string | null;
}

export interface Episode{
  episodeID: number;
  episodeName: string;
  episodeNumber: number;
  overview?: string | null;
  runtime: number;
  seasonId: number;
  stillPath?: string | null;
  voteAverage: number;
  voteCount: number;
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

export interface TvStore{
  tvShows: Ref<Tv[]>;
  filterTvShows: Ref<Tv[]>;
  lastFetched: Ref<number | null>;
  fetchTvShows: (force?: boolean) => Promise<Tv[]>;
  getTvShowById: (id: string | number) => Tv | null;
  getTvRecommendation: (id: string | number) => Promise<Tv[]>;
  fetchFilterShows: (
    force?: boolean,
    query?: string,
    searchTermTerm?: number | null,
    minYear?: number | null,
    maxYear?: number | null
  ) => Promise<Tv[]>;
}

export interface SeasonStore{
  seasons: Ref<Record<number,Season[]>>;
  fetchSeasonsByTvShowId: (tvShowID: number) => Promise<Season[]>;
  getSeasonByShowAndNum: (tvShowID: number, seasonNumber: number) => Promise<Season | null>;
}

export interface EpisodeStore{
  episodes: Ref<Record<number,Episode[]>>;
  fetchEpisodesBySeasonId: (seasonID: number) => Promise<Episode[]>;
  getEpisodeById: (seasonID: number, episodeID: number) => Episode | null;
}
