import { Router } from "express";

import moviesController from "./movies.controller";
import auth from "../../middleware/auth";
import admin from "../../middleware/admin";

const router = Router();

router.get("/", moviesController.getAll);
router.get("/:movieId", moviesController.getById);
router.post("/", auth, admin, moviesController.create);
router.put("/:movieId", auth, admin, moviesController.update);
router.delete("/:movieId", auth, admin, moviesController.remove);

export default router;
