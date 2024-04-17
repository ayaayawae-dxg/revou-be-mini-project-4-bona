import { Router } from "express";

import moviesController from "./movies.controller";
import auth from "../../middleware/auth";
import admin from "../../middleware/admin";

const router = Router();

router.get("/", moviesController.getAll);
router.get("/:movieId", moviesController.getById);
router.post("/", auth, admin, moviesController.create);
router.put("/", moviesController.create);
router.delete("/", moviesController.getById);

export default router;
