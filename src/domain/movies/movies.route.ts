import { Router } from "express";

import moviesController from "./movies.controller";

const router = Router();

router.get("/", moviesController.getAll);
router.get("/:movieId", moviesController.getById);

export default router;
