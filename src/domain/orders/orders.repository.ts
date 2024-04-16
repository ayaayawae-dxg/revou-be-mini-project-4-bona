import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import { createError } from "../../common/createError";
import { CreateOrderModel, CreateOrderResponse } from "../orders/orders.model";
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

export default {
  create,
};
