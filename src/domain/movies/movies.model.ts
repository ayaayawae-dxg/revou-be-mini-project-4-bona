export interface MoviesCastModel {
  actor: string;
  as_character: string;
}

export interface MoviesModel {
  id: number;
  title: string;
  duration: number;
}

export interface MoviesByIdModel {
  id: number;
  title: string;
  rating: string;
  duration: number;
  synopsis: string;
}

export interface MoviesRawModel extends MoviesModel {
  genre: string;
  show_time: string;
}

export interface MoviesByIdRawModel extends MoviesByIdModel, MoviesCastModel {
  director: string;
  show_time: string;
  genre: string;
}

export interface GetMoviesRequest {}

export interface GetMoviesResponse extends MoviesModel {
  genre: string[];
  show_time: string[];
}

export interface GetMoviesByIdRequest {
  movieId: number;
}

export interface GetMoviesByIdResponse extends MoviesByIdModel {
  cast: MoviesCastModel[];
  director: string[];
  genre: string[];
  show_time: string[];
}

export interface CreateMovieResponse {
  id: number;
}

export interface CreateMovieRequest {
  title: string;
  rating: string;
  duration: number;
  synopsis: string;
  director: string[];
  cast: MoviesCastModel[];
  genre: string[];
}

export interface UpdateMovieResponse {
  id: number;
}

export interface UpdateMovieRequest extends CreateMovieRequest {
  id: number;
}

export interface CheckUpdateDuplicateTitleModel {
  title: string;
  id: number;
}

export interface DeleteMovieRequest {
  movieId: number;
}