import { Request, Response } from "express";
import { successRes } from "../../common/response";

const getAll = (req: Request, res: Response) => {
  successRes(res, {
    status: 200,
    message: "Get User Success",
  });
}

export default {
  getAll
}