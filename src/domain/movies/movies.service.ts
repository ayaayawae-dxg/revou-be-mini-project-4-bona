import { PoolConnection } from "mysql2/promise";

import config from "../../config/config";
import { createError } from "../../common/createError";

import {
  GetMoviesRequest,
  GetMoviesResponse,
  MoviesRawModel,
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

      if (!groupedMovies[id].show_time.includes(show_time)) {
        groupedMovies[id].show_time.push(show_time);
      }

      if (!groupedMovies[id].director.includes(director)) {
        groupedMovies[id].director.push(director);
      }

      if (!groupedMovies[id].genre.includes(genre)) {
        groupedMovies[id].genre.push(genre);
      }

      if (!groupedMovies[id].cast.find(v => v.actor === actor && v.as_character === as_character)) {
        groupedMovies[id].cast.push({ actor, as_character });
      }
    });

    return Object.values(groupedMovies);
  };

  return restructureData(moviesData);
};

export default {
  get,
};
