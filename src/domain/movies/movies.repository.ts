import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import { createError } from "../../common/createError";
import { CheckUpdateDuplicateTitleModel, CreateMovieRequest, CreateMovieResponse, MoviesByIdRawModel, MoviesModel, MoviesRawModel, UpdateMovieRequest, UpdateMovieResponse } from "../movies/movies.model";

const get = async (connection: PoolConnection): Promise<MoviesRawModel[]> => {
  const query = `
      SELECT 
        m.id, m.title, m.duration
        , s.show_time
        , mgm.genre 
      FROM movies m 
      LEFT JOIN screening s 
        ON s.movie_id = m.id
      LEFT JOIN movies_genre_map mgm 
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
      ms.id, ms.title, ms.created_at, ms.rating, ms.duration, ms.synopsis
      , ms.show_time, mcm.actor, mcm.as_character, mdm.director
      , mgm.genre 
    FROM (
      SELECT 
        m.id, m.title, m.created_at, m.rating, m.duration, m.synopsis
        , s.show_time
      FROM movies m 
      LEFT JOIN screening s ON m.id = s.movie_id
      WHERE m.id = ${moviesId}
    ) as ms
    LEFT JOIN movies_cast_map mcm 
      ON ms.id = mcm.movie_id 
    LEFT JOIN movies_director_map mdm
      ON ms.id = mdm.movie_id 
    LEFT JOIN movies_genre_map mgm 
      ON ms.id = mgm.movie_id
    ORDER BY ms.show_time ASC
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
  const insertedId = rows.insertId

  if (rows.affectedRows > 0) {
    const queryCreateDirector = `INSERT INTO movies_director_map (movie_id, director) VALUES ?`;
    const valueCreateDirector = createMovie.director.map((director) => {
      return [insertedId, director];
    });
    await connection.query<ResultSetHeader>(queryCreateDirector, [valueCreateDirector]);

    const queryCreateCast = `INSERT INTO movies_cast_map (movie_id, actor, as_character) VALUES ?`;
    const valueCreateCast = createMovie.cast.map((cast) => {
      return [insertedId, cast.actor, cast.as_character];
    });
    await connection.query<ResultSetHeader>(queryCreateCast, [valueCreateCast]);

    const queryCreateGenre = `INSERT INTO movies_genre_map (movie_id, genre) VALUES ?`;
    const valueCreateGenre = createMovie.genre.map((genre) => {
      return [insertedId, genre];
    });
    await connection.query<ResultSetHeader>(queryCreateGenre, [valueCreateGenre]);
  }

  return { id: insertedId };
};

const checkDuplicateTitle = async (connection: PoolConnection, title: string): Promise<Boolean> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    `SELECT title FROM movies WHERE title = "${title}"`
  );
  return rows.length > 0 ? true : false
};

const checkUpdateDuplicateTitle = async (connection: PoolConnection, { title, id }: CheckUpdateDuplicateTitleModel): Promise<Boolean> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    `SELECT title FROM movies WHERE title = "${title}" AND id <> ${id}`
  );
  return rows.length > 0 ? true : false
};

const update = async (connection: PoolConnection, updateMovie: UpdateMovieRequest): Promise<UpdateMovieResponse> => {
  const query = `
    UPDATE movies 
    SET
      title = "${updateMovie.title}", 
      rating = "${updateMovie.rating}", 
      duration = ${updateMovie.duration}, 
      synopsis = "${updateMovie.synopsis}"
    WHERE id = ${updateMovie.id};
  `;
  const [rows] = await connection.query<ResultSetHeader>(query);
  const updatedId = updateMovie.id

  if (rows.affectedRows > 0) {
    const queryDeleteDirector = `DELETE FROM movies_director_map WHERE movie_id = ${updatedId}`
    await connection.query<ResultSetHeader>(queryDeleteDirector);
    const queryCreateDirector = `INSERT INTO movies_director_map (movie_id, director) VALUES ?`;
    const valueCreateDirector = updateMovie.director.map((director) => {
      return [updatedId, director];
    });
    await connection.query<ResultSetHeader>(queryCreateDirector, [valueCreateDirector]);

    const queryDeleteCast = `DELETE FROM movies_cast_map WHERE movie_id = ${updatedId}`
    await connection.query<ResultSetHeader>(queryDeleteCast);
    const queryCreateCast = `INSERT INTO movies_cast_map (movie_id, actor, as_character) VALUES ?`;
    const valueCreateCast = updateMovie.cast.map((cast) => {
      return [updatedId, cast.actor, cast.as_character];
    });
    await connection.query<ResultSetHeader>(queryCreateCast, [valueCreateCast]);

    const queryDeleteGenre = `DELETE FROM movies_genre_map WHERE movie_id = ${updatedId}`
    await connection.query<ResultSetHeader>(queryDeleteGenre);
    const queryCreateGenre = `INSERT INTO movies_genre_map (movie_id, genre) VALUES ?`;
    const valueCreateGenre = updateMovie.genre.map((genre) => {
      return [updatedId, genre];
    });
    await connection.query<ResultSetHeader>(queryCreateGenre, [valueCreateGenre]);
  }

  return { id: updateMovie.id };
};

const remove = async (connection: PoolConnection, movie_id: number): Promise<void> => {
  const query = `
    UPDATE movies 
    SET
      is_active = "N"
    WHERE id = ${movie_id};
  `;
  await connection.query<ResultSetHeader>(query);
};

export default {
  get,
  getDetail,
  create,
  checkDuplicateTitle,
  checkUpdateDuplicateTitle,
  update,
  remove
};
