import { NextFunction, Request, Response } from "express";

import pool from "../../config/db";
import { successRes } from "../../common/response";
import { createNextError } from "../../common/createError";

import { CreateOrderRequest } from "./orders.model";
import ordersService from "./orders.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const createOrderRequest = req.body as CreateOrderRequest;
    const createOrderResponse = await ordersService.create(connection, {
      ...createOrderRequest,
      user_id: req.app.locals.user_id,
    });

    await successRes(connection, res, {
      message: "Orders created successfully",
      status: 201,
      data: createOrderResponse,
    });
  } catch (error) {
    await createNextError(connection, () => next(error));
  }
};

export default {
  create,
};
