import { Router } from "express";

import appRoute from "./domain/app/app.route";
import userRoute from "./domain/user/user.route";
import authRoute from "./domain/auth/auth.route";

const router = Router();

router.use("/", appRoute);
router.use("/user", userRoute)
router.use("/auth", authRoute)

export default router;
