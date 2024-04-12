import { NextFunction, Request, Response } from "express";

import { successRes } from "../../common/response";
import pool from "../../config/db";
import { createNextError } from "../../common/createError";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    await successRes(connection, res, {
      message: "Get user success",
      status: 200,
    });
  } catch (error) {
    await createNextError(connection, () => next(error))
  }
};

export default {
  getAll,
};
