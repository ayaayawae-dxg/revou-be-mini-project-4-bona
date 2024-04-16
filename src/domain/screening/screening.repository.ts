import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import { createError } from "../../common/createError";
import { CheckSeatModel, GetIdByMovieAndTimeModel } from "./screening.model";

const getByMovieAndTime = async (connection: PoolConnection, { movie_id, show_time }: GetIdByMovieAndTimeModel): Promise<string> => {
  const queryCreateOrders = `
    SELECT id, movie_id, theatre_id, show_time FROM screening WHERE movie_id = ${movie_id} AND show_time = "${show_time}"
  `;
  const [rows] = await connection.query<RowDataPacket[]>(queryCreateOrders);

  return rows.length > 0 ? rows[0].id : null;
};

const checkSeat = async (connection: PoolConnection, { screening_id, seat_id }: CheckSeatModel): Promise<boolean> => {
  const query = `
    SELECT od.seat_id from screening s 
    JOIN orders o 
      ON o.screening_id = s.id 
        AND s.id = ?
    JOIN orders_detail od 
      ON od.order_id = o.id 
        AND od.seat_id IN (?)
  `;
  const values = [screening_id, seat_id]
  const [rows] = await connection.query<RowDataPacket[]>(query, values);

  return rows.length > 0 ? false : true;
};

export default {
  getByMovieAndTime,
  checkSeat
};
