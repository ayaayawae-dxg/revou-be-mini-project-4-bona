import { PoolConnection } from "mysql2/promise";

import config from "../../config/config";
import { createError } from "../../common/createError";

import {
  CreateOrderModel,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderHistoryRawModel,
  GetOrderHistoryRequest,
  GetOrderHistoryResponse,
} from "./orders.model";
import ordersRepository from "./orders.repository";
import screeningRepository from "../screening/screening.repository";

const create = async (
  connection: PoolConnection,
  createOrderRequest: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  const { movie_id, show_time, seat_id, user_id } = createOrderRequest;

  const screening_id = await screeningRepository.getByMovieAndTime(connection, {
    movie_id,
    show_time,
  });
  if (!screening_id) {
    createError({
      message: "No screening time for the selected movie",
      status: 200,
    });
  }

  const isSeatAvailable = await screeningRepository.checkSeat(connection, {
    screening_id,
    seat_id,
  });
  if (!isSeatAvailable) {
    createError({
      message: "Seat is already filled. Please choose another seat.",
      status: 200,
    });
  }

  const createOrderModel: CreateOrderModel = {
    screening_id: screening_id,
    seat_id: seat_id,
    user_id: user_id,
  };

  const orderId = await ordersRepository.create(connection, createOrderModel);

  return orderId;
};

const getOrderHistory = async (
  connection: PoolConnection,
  getOrderHistoryRequest: GetOrderHistoryRequest
): Promise<GetOrderHistoryResponse[]> => {
  const { user_id } = getOrderHistoryRequest;

  const orderHistoryData = await ordersRepository.getOrderHistory(
    connection,
    user_id
  );

  const restructureData = (
    orderHistory: GetOrderHistoryRawModel[]
  ): GetOrderHistoryResponse[] => {
    const temp: GetOrderHistoryResponse[] = orderHistory.map((order) => {
      const seatId = order.seat_id.split(",");
      const seat = order.seat.split(",");
      const groupedSeat = seatId.map((id, idx) => ({ id: parseInt(id), seat: seat[idx] }));

      return {
        id: order.id,
        seat: groupedSeat,
        show_time: order.show_time,
        status: order.status,
        title: order.title
      };
    });

    return temp;
  };

  return restructureData(orderHistoryData);
};

export default {
  create,
  getOrderHistory,
};
