import { Router } from "express";

import ordersController from "./orders.controller";

const router = Router();

router.post("/", ordersController.create);

export default router;
