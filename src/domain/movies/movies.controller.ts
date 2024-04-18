import { NextFunction, Request, Response } from "express";

import pool from "../../config/db";
import { successRes } from "../../common/response";
import { createNextError } from "../../common/createError";

import { CreateMovieRequest, GetMoviesByIdRequest, GetMoviesRequest, UpdateMovieRequest } from "./movies.model";
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

const getById = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const getMoviesByIdRequest = req.params as unknown as GetMoviesByIdRequest;
    const getMoviesByIdResponse = await moviesService.getById(connection, getMoviesByIdRequest);

    await successRes(connection, res, {
      message: "Movies detail fetched successfully",
      status: 200,
      data: getMoviesByIdResponse,
    });
  } catch (error) {
    await createNextError(connection, () => next(error))
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const createMovieRequest = req.body as CreateMovieRequest;
    const createMovieResponse = await moviesService.create(connection, createMovieRequest);

    await successRes(connection, res, {
      message: "Movies created successfully",
      status: 201,
      data: createMovieResponse,
    });
  } catch (error) {
    await createNextError(connection, () => next(error));
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const updateMovieRequest = req.body as UpdateMovieRequest;
    const updateMovieResponse = await moviesService.update(connection, updateMovieRequest);

    await successRes(connection, res, {
      message: "Movies updated successfully",
      status: 200,
      data: updateMovieResponse,
    });
  } catch (error) {
    await createNextError(connection, () => next(error));
  }
}

export default {
  getAll,
  getById,
  create,
  update
};
