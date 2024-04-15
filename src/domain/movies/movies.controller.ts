import { NextFunction, Request, Response } from "express";

import pool from "../../config/db";
import { successRes } from "../../common/response";
import { createNextError } from "../../common/createError";

import { GetMoviesRequest } from "./movies.model";
import moviesService from "./movies.service";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const getMoviesRequest = req.params as GetMoviesRequest;
    const getMoviesResponse = await moviesService.get(connection, getMoviesRequest);

    await successRes(connection, res, {
      message: "Movies fetched successfully",
      status: 200,
      data: getMoviesResponse,
    });
  } catch (error) {
    await createNextError(connection, () => next(error))
  }
};

export default {
  getAll
};
