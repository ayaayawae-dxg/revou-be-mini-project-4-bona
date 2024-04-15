export interface MoviesCastModel {
  actor: string;
  as_character: string;
}

export interface MoviesModel {
  id: number;
  title: string;
  rating: string;
  duration: number;
  synopsis: string;
}

export interface MoviesRawModel extends MoviesModel, MoviesCastModel {
  director: string;
  show_time: string;
  genre: string,
}

export interface GetMoviesRequest {}

export interface GetMoviesResponse extends MoviesModel {
  cast: MoviesCastModel[];
  director: string[];
  genre: string[];
  show_time: string[]
}