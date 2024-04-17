import { Request, Response, NextFunction } from "express";

const admin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.app.locals.user.role
    if (role !== "ADMIN") {
      throw new Error("You are not allowed")
    }

    next();
  } catch (error) {
    let errorMessage = "Admin Only"

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(403).json({
      success: false,
      message: errorMessage
    })
  }
};

export default admin;
