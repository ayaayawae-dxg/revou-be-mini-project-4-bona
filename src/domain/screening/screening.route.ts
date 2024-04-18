import { Router } from "express";

import screeningController from "./screening.controller";

const router = Router();

router.post("/", screeningController.create);

export default router;
