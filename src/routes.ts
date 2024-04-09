import { Router } from "express";

import appRoute from "./domain/app/app.route";
import userRoute from "./domain/user/user.route";

const router = Router();

router.use("/", appRoute);
router.use("/user", userRoute)

export default router;
