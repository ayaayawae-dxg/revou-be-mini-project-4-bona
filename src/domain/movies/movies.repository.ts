import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import { createError } from "../../common/createError";
import { MoviesRawModel } from "../movies/movies.model";

const get = async (connection: PoolConnection): Promise<MoviesRawModel[]> => {
  const query = `
      SELECT 
        m.id, m.title, m.created_at, m.rating, m.duration, m.synopsis
        , s.show_time
        , mcm.actor, mcm.as_character, mdm.director
        , mgm.genre 
      FROM movies m 
      JOIN screening s 
        ON s.movie_id = m.id
      JOIN movies_cast_map mcm 
        ON m.id = mcm.movie_id 
      JOIN movies_director_map mdm
        ON m.id = mdm.movie_id 
      JOIN movies_genre_map mgm 
        ON m.id = mgm.movie_id 
      ORDER BY m.id ASC, s.show_time ASC
  `;
  const [rows] = await connection.query<RowDataPacket[]>({sql: query, nestTables: false});

  const movies: MoviesRawModel[] = rows.map(row => ({
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

export default {
  get,
};
