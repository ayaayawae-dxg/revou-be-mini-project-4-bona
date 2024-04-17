import { RowDataPacket } from "mysql2";

export interface OrdersModel extends RowDataPacket {
  id: string;
  user_id: number;
  screening_id: string;
  status: string;
  orders_detail: OrdersDetailModel[];
}

export interface OrdersDetailModel {
  id: string;
  order_id: number;
  seat_id: number;
}

export interface CreateOrderRequest {
  movie_id: string;
  show_time: string;
  seat_id: number[];
  user_id: number;
}

export interface CreateOrderResponse {
  id: string;
}

export interface CreateOrderModel {
  screening_id: string;
  user_id: number;
  seat_id: number[];
}

export interface GetOrderHistoryRawModel {
  id: string;
  status: string;
  seat_id: string;
  seat: string;
  show_time: string;
  title: string;
}

export interface GetOrderHistoryRequest {
  user_id: number;
}

export interface GetOrderHistoryResponse {
  id: string;
  status: string;
  seat: {
    id: number,
    seat: string;
  }[];
  show_time: string;
  title: string;
}