import { Request, Response, NextFunction } from "express";

interface ErrorStatus extends Error {
  status: number;
}

interface SuccessDataProp {
  status: number;
  message: string;
  data?: undefined | any;
}

export const errorRes = (
  err: ErrorStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const errStack = err.stack;

  console.error(errStack);
  res.status(status).send({
    success: false,
    status: status,
    message: message,
  });
};

export const successRes = (res: Response, data: SuccessDataProp) => {
  const status = data.status || 200;
  const message = data.message || "Success";
  const payload = data.data || undefined;

  res.status(status).send({
    success: true,
    status: status,
    message: message,
    data: payload,
  });
};
