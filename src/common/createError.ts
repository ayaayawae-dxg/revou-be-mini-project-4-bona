import { NextFunction } from "express";
import { PoolConnection } from "mysql2/promise";

interface createErrorProp {
  message: string;
  status: number;
}

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const createError = ({ message, status }: createErrorProp) => {
  const error = new CustomError(message, status);
  error.status = status;
  throw error;
};

export const createNextError = async (
  connection: PoolConnection,
  callback: () => void
) => {
  await connection.rollback();
  connection.release();
  callback();
};
