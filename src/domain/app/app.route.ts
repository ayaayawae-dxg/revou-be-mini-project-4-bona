import { Router } from "express";
import appController from "./app.controller";

const router = Router();

router.get("/", appController.home);

export default router;
