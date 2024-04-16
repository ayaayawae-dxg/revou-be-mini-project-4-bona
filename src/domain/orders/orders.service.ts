import { PoolConnection } from "mysql2/promise";

import config from "../../config/config";
import { createError } from "../../common/createError";

import {
  CreateOrderModel,
  CreateOrderRequest,
  CreateOrderResponse,
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
    createError({ message: "No screening time for the selected movie", status: 200 })
  }

  const isSeatAvailable = await screeningRepository.checkSeat(connection, { screening_id, seat_id })
  if (!isSeatAvailable) {
    createError({ message: "Seat is already filled. Please choose another seat.", status: 200 })
  }

  const createOrderModel: CreateOrderModel = {
    screening_id: screening_id,
    seat_id: seat_id,
    // user_id: user_id,
    user_id: 1,
  };

  const orderId = await ordersRepository.create(connection, createOrderModel);

  return orderId;
};

export default {
  create,
};
