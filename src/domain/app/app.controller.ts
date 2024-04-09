import { Request, Response } from "express";
import { successRes } from "../../common/response";

const home = (req: Request, res: Response) => {
  successRes(res, {
    status: 200,
    message: "URL Shortener API",
  });
}

export default {
  home
}