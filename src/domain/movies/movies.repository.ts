import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import { createError } from "../../common/createError";
import { CreateMovieRequest, CreateMovieResponse, MoviesByIdRawModel, MoviesModel, MoviesRawModel } from "../movies/movies.model";

const get = async (connection: PoolConnection): Promise<MoviesRawModel[]> => {
  const query = `
      SELECT 
        m.id, m.title, m.duration
        , s.show_time
        , mgm.genre 
      FROM movies m 
      JOIN screening s 
        ON s.movie_id = m.id
      JOIN movies_genre_map mgm 
        ON m.id = mgm.movie_id 
      ORDER BY m.id ASC, s.show_time ASC
  `;
  const [rows] = await connection.query<RowDataPacket[]>(query);

  const movies: MoviesRawModel[] = rows.map(row => ({
    id: row.id,
    title: row.title,
    duration: row.duration,
    show_time: row.show_time,
    genre: row.genre
  }))

  return movies
};

const getDetail = async (connection: PoolConnection, moviesId: number): Promise<MoviesByIdRawModel[]> => {
  const query = `
      SELECT 
        m.id, m.title, m.created_at, m.rating, m.duration, m.synopsis
        , s.show_time
        , mcm.actor, mcm.as_character, mdm.director
        , mgm.genre 
      FROM movies m 
      JOIN screening s 
        ON s.movie_id = m.id
          AND m.id = ${moviesId}
      JOIN movies_cast_map mcm 
        ON m.id = mcm.movie_id 
      JOIN movies_director_map mdm
        ON m.id = mdm.movie_id 
      JOIN movies_genre_map mgm 
        ON m.id = mgm.movie_id 
      ORDER BY m.id ASC, s.show_time ASC
  `;
  const [rows] = await connection.query<RowDataPacket[]>(query);

  const movies: MoviesByIdRawModel[] = rows.map(row => ({
    id: row.id,
    title: row.title,
    rating: row.rating,
    duration: row.duration,
    synopsis: row.synopsis,
    show_time: row.show_time,
    actor: row.actor,
    as_character: row.as_character,
    director: row.director,
    genre: row.genre
  }))

  return movies
};

const create = async (connection: PoolConnection, createMovie: CreateMovieRequest): Promise<CreateMovieResponse> => {
  const query = `
    INSERT INTO movies (title, rating, duration, synopsis) 
    VALUES ("${createMovie.title}", "${createMovie.rating}", ${createMovie.duration}, "${createMovie.synopsis}");
  `;
  const [rows] = await connection.query<ResultSetHeader>(query);

  return { id: rows.insertId };
};

const checkDuplicateTitle = async (connection: PoolConnection, title: string): Promise<Boolean> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    `SELECT title FROM movies WHERE title = "${title}"`
  );
  return rows.length > 0 ? true : false
};

export default {
  get,
  getDetail,
  create,
  checkDuplicateTitle
};
