import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import config from "../config/config";

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw new Error("No token provided")
    }

    const token = authHeader?.split(" ")[1] as string;
    const payload = verify(token, config.jwt_secret as string);

    req.app.locals.user = payload;

    next();
  } catch (error) {
    let errorMessage = "Invalid token"
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(401).json({
      success: false,
      message: errorMessage
    })
  }
};

export default auth;
