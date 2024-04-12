import { NextFunction, Request, Response } from "express";

import { successRes } from "../../common/response";
import { CreateUserRequest } from "./auth.model";
import authService from "./auth.service";
import pool from "../../config/db";
import { createNextError } from "../../common/createError";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const createUserRequest = req.body as CreateUserRequest;
    const createUserResponse = await authService.register(createUserRequest);

    await successRes(connection, res, {
      message: "User registered successfully",
      status: 201,
      data: createUserResponse,
    });
  } catch (error) {
    await createNextError(connection, () => next(error))
  }
};

export default {
  register,
};
