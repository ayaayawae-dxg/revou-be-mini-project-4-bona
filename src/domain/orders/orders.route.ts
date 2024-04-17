import { Router } from "express";

import ordersController from "./orders.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth, ordersController.create);

export default router;
