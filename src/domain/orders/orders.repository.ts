import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import { createError } from "../../common/createError";
import { CreateOrderModel, CreateOrderResponse, GetOrderHistoryRawModel } from "../orders/orders.model";
import { randomUUID } from "crypto";

const create = async (connection: PoolConnection, createOrder: CreateOrderModel): Promise<CreateOrderResponse> => {
  const id = randomUUID();
  const queryCreateOrders = `
    INSERT INTO orders (id, user_id, screening_id, status) 
    VALUES ("${id}", "${createOrder.user_id}", "${createOrder.screening_id}", "READY");
  `;
  const [rows] = await connection.query<ResultSetHeader>(queryCreateOrders);

  if (rows.affectedRows > 0) {
    const queryCreateOrdersDetail = `INSERT INTO orders_detail (order_id, seat_id) VALUES ?;`;
    const valueCreateOrdersDetail = createOrder.seat_id.map((seatId) => {
      return [id, seatId];
    });
    await connection.query<ResultSetHeader>(queryCreateOrdersDetail, [valueCreateOrdersDetail]);
  }

  return { id };
};

const getOrderHistory = async (connection: PoolConnection, user_id: number): Promise<GetOrderHistoryRawModel[]> => {
  const query = `
    SELECT 
      o.id, o.status
      , GROUP_CONCAT(od.seat_id) as seat_id
      , GROUP_CONCAT(ts.seat) as seat
      , s.show_time 
      , m.title 
    FROM orders o
    JOIN orders_detail od 
      ON od.order_id = o.id AND user_id = ${user_id}
    JOIN screening s ON s.id = o.screening_id 
    JOIN movies m ON m.id = s.movie_id 
    JOIN theatres_seat ts on ts.id = od.seat_id 
    GROUP BY id
  `;
  const [rows] = await connection.query<RowDataPacket[]>(query);

  const orderHistory: GetOrderHistoryRawModel[] = rows.map(row => ({
    id: row.id,
    status: row.status,
    seat_id: row.seat_id,
    seat: row.seat,
    show_time: row.show_time,
    title: row.title,
  }))

  return orderHistory
};

export default {
  create,
  getOrderHistory
};
