import { NextFunction, Request, Response } from "express";

import pool from "../../config/db";
import { successRes } from "../../common/response";
import { createNextError } from "../../common/createError";

import { CreateScreeningRequest } from "./screening.model";
import screeningService from "./screening.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const createScreeningRequest = req.body as CreateScreeningRequest;
    const createScreeningResponse = await screeningService.create(connection, createScreeningRequest);

    await successRes(connection, res, {
      message: "Screening created successfully",
      status: 201,
      data: createScreeningResponse,
    });
  } catch (error) {
    await createNextError(connection, () => next(error));
  }
}

export default {
  create
};
