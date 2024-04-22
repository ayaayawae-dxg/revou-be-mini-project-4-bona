import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import { createError } from "../../common/createError";
import { CheckSeatModel, CreateScreeningRequest, CreateScreeningResponse, GetIdByMovieAndTimeModel } from "./screening.model";
import { randomUUID } from "crypto";

const getByMovieAndTime = async (connection: PoolConnection, { movie_id, show_time }: GetIdByMovieAndTimeModel): Promise<string> => {
  const queryCreateOrders = `
    SELECT id, movie_id, theatre_id, show_time FROM screening WHERE movie_id = ${movie_id} AND show_time = "${show_time}"
  `;
  const [rows] = await connection.query<RowDataPacket[]>(queryCreateOrders);

  return rows.length > 0 ? rows[0].id : null;
};

const checkSeat = async (connection: PoolConnection, { screening_id, seat_id }: CheckSeatModel): Promise<boolean> => {
  await connection.query("SELECT id FROM theatres_seat WHERE id IN (?) FOR UPDATE;", [seat_id])

  const query = `
   SELECT od.seat_id from screening s 
    JOIN orders o 
      ON o.screening_id = s.id 
        AND s.id = ?
    JOIN orders_detail od 
      ON od.order_id = o.id 
        AND od.seat_id IN (?);
  `;
  const values = [screening_id, seat_id]
  const [rows] = await connection.query<RowDataPacket[]>(query, values);

  return rows.length > 0 ? false : true;
};

const create = async (connection: PoolConnection, createScreeningRequest: CreateScreeningRequest): Promise<void> => {
  const { movie_id, show_time, theatre_id } = createScreeningRequest
  const query = `
    INSERT INTO screening (id, movie_id, theatre_id, show_time) VALUES ?
  `;
  const values = show_time.map((showtime => {
    const id = randomUUID();
    return [id, movie_id, theatre_id, showtime]
  }))
  const [rows] = await connection.query<ResultSetHeader>(query, [values]);
};

const checkdDuplicateShowtime = async (connection: PoolConnection, createScreeningRequest: CreateScreeningRequest): Promise<boolean> => {
  const { movie_id, theatre_id, show_time } = createScreeningRequest;
  const query = `
    select show_time 
    FROM screening 
    WHERE movie_id = ? AND theatre_id = ? AND show_time IN (?)
  `;
  const values = [movie_id, theatre_id, show_time]
  const [rows] = await connection.query<RowDataPacket[]>(query, values);

  return rows.length > 0 ? true : false;
};

export default {
  getByMovieAndTime,
  checkSeat,
  create,
  checkdDuplicateShowtime
};
