import { NextFunction, Request, Response } from "express";

import pool from "../../config/db";
import { successRes } from "../../common/response";
import { createNextError } from "../../common/createError";
import { CreateUserRequest, LoginRequest } from "./auth.model";
import authService from "./auth.service";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const createUserRequest = req.body as CreateUserRequest;
    const createUserResponse = await authService.register(connection, createUserRequest);

    await successRes(connection, res, {
      message: "User registered successfully",
      status: 201,
      data: createUserResponse,
    });
  } catch (error) {
    await createNextError(connection, () => next(error))
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const loginRequest = req.body as LoginRequest;
    const loginResponse = await authService.login(connection, loginRequest);

    await successRes(connection, res, {
      message: "Login successfully",
      status: 200,
      data: loginResponse,
    });
  } catch (error) {
    await createNextError(connection, () => next(error))
  }
};

export default {
  register,
  login,
};
