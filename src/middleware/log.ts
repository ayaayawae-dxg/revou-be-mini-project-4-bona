import { Request, Response, NextFunction } from "express";

const log = (req: Request, res: Response, next: NextFunction) => {
  const start = new Date();
  const startIso = start.toISOString();

  res.on("finish", () => {
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const duration = new Date().getTime() - start.getTime();

    console.log(
      `${startIso} ${method} ${originalUrl} ${statusCode} - - ${duration} ms`
    );
  });
  next();
};

export default log;
