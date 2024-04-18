import { Router } from "express";

import screeningController from "./screening.controller";
import auth from "../../middleware/auth";
import admin from "../../middleware/admin";

const router = Router();

router.post("/", auth, admin, screeningController.create);

export default router;
