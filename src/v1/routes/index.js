import { Router } from "express";

import v1AuthRouter from "./authRoutes.js";
import v1PostRouter from "./postRoutes.js";
import v1UserRouter from "./userRoutes.js";

const router = Router();

router.use("/auth", v1AuthRouter);
router.use("/posts", v1PostRouter);
router.use("/users", v1UserRouter);

export default router;
