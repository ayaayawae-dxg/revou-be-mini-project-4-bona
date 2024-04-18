import { PoolConnection } from "mysql2/promise";

import config from "../../config/config";
import { createError } from "../../common/createError";

import {
  CreateMovieRequest,
  CreateMovieResponse,
  DeleteMovieRequest,
  GetMoviesByIdRequest,
  GetMoviesByIdResponse,
  GetMoviesRequest,
  GetMoviesResponse,
  MoviesByIdRawModel,
  MoviesRawModel,
  UpdateMovieRequest,
  UpdateMovieResponse,
} from "./movies.model";
import moviesRepository from "./movies.repository";

const get = async (
  connection: PoolConnection,
  getMoviesRequest: GetMoviesRequest
): Promise<GetMoviesResponse[]> => {
  const { } = getMoviesRequest;

  const moviesData = await moviesRepository.get(connection);

  const restructureData = (movies: MoviesRawModel[]): GetMoviesResponse[] => {
    const groupedMovies: { [key: number]: GetMoviesResponse } = {};

    movies.forEach((movie) => {
      const { id, title, duration, genre, show_time } = movie;

      if (!groupedMovies[id]) {
        groupedMovies[id] = {
          id,
          title,
          duration,
          show_time: [],
          genre: [],
        };
      }

      if (!groupedMovies[id].show_time.includes(show_time) && show_time) {
        groupedMovies[id].show_time.push(show_time);
      }

      if (!groupedMovies[id].genre.includes(genre) && genre) {
        groupedMovies[id].genre.push(genre);
      }
    });

    return Object.values(groupedMovies);
  };

  return restructureData(moviesData);
};

const getById = async (
  connection: PoolConnection,
  getMoviesByIdRequest: GetMoviesByIdRequest
): Promise<GetMoviesByIdResponse> => {
  const { movieId } = getMoviesByIdRequest;

  const moviesData = await moviesRepository.getDetail(connection, movieId);

  const restructureData = (movies: MoviesByIdRawModel[]): GetMoviesByIdResponse => {
    const groupedMovies: { [key: number]: GetMoviesByIdResponse } = {};

    movies.forEach((movie) => {
      const { id, title, rating, duration, synopsis, show_time, director, genre, actor, as_character } = movie;

      if (!groupedMovies[id]) {
        groupedMovies[id] = {
          id,
          title,
          rating,
          duration,
          synopsis,
          show_time: [],
          cast: [],
          director: [],
          genre: [],
        };
      }

      if (!groupedMovies[id].show_time.includes(show_time) && show_time) {
        groupedMovies[id].show_time.push(show_time);
      }

      if (!groupedMovies[id].director.includes(director) && director) {
        groupedMovies[id].director.push(director);
      }

      if (!groupedMovies[id].genre.includes(genre) && genre) {
        groupedMovies[id].genre.push(genre);
      }

      if (
        !groupedMovies[id].cast.find(v => v.actor === actor && v.as_character === as_character)
        && (actor || as_character)
      ) {
        groupedMovies[id].cast.push({ actor, as_character });
      }
    });

    return Object.values(groupedMovies)[0];
  };

  return restructureData(moviesData);
};

const create = async (
  connection: PoolConnection,
  createMovieRequest: CreateMovieRequest
): Promise<CreateMovieResponse> => {
  const { title } = createMovieRequest;

  const isTitleDuplicate = await moviesRepository.checkDuplicateTitle(connection, title);
  if (isTitleDuplicate) {
    createError({
      message: "Movies with same title already registered.",
      status: 200,
    });
  }

  const createMovie = await moviesRepository.create(connection, createMovieRequest);

  return createMovie;
};

const update = async (
  connection: PoolConnection,
  updateMovieRequest: UpdateMovieRequest
): Promise<UpdateMovieResponse> => {
  const { id, title } = updateMovieRequest;

  const isTitleDuplicate = await moviesRepository.checkUpdateDuplicateTitle(connection, { title, id });
  if (isTitleDuplicate) {
    createError({
      message: "Movies with same title already registered.",
      status: 200,
    });
  }

  const updateMovie = await moviesRepository.update(connection, updateMovieRequest);

  return updateMovie;
};

const remove = async (
  connection: PoolConnection,
  deleteMovieRequest: DeleteMovieRequest
): Promise<void> => {
  const { movieId } = deleteMovieRequest;

  await moviesRepository.remove(connection, movieId);
};

export default {
  get,
  getById,
  create,
  update,
  remove
};
