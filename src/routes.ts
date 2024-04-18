import { Router } from "express";

import appRoute from "./domain/app/app.route";
import userRoute from "./domain/user/user.route";
import authRoute from "./domain/auth/auth.route";
import moviesRoute from "./domain/movies/movies.route";
import ordersRoute from "./domain/orders/orders.route";
import screeningRoute from "./domain/screening/screening.route";

const router = Router();

router.use("/", appRoute);
router.use("/user", userRoute);
router.use("/auth", authRoute);
router.use("/movies", moviesRoute);
router.use("/orders", ordersRoute);
router.use("/screening", screeningRoute);

export default router;
