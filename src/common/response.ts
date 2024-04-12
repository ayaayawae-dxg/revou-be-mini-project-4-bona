import { Request, Response, NextFunction } from "express";
import { PoolConnection } from "mysql2/promise";

interface ErrorStatus extends Error {
  status: number;
}

interface SuccessDataProp {
  status: number;
  message: string;
  data?: undefined | any;
}

export const errorRes = async (
  err: ErrorStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const errStack = err.stack;

  console.error(errStack);
  res.status(status).json({
    success: false,
    status: status,
    message: message,
  });
};

export const successRes = async (connection: PoolConnection, res: Response, data: SuccessDataProp) => {
  const status = data.status || 200;
  const message = data.message || "Success";
  const payload = data.data || undefined;

  await connection.commit();
  connection.release()

  res.status(status).json({
    success: true,
    status: status,
    message: message,
    data: payload,
  });
};
