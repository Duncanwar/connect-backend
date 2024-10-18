import { Router } from "express";
require("dotenv").config();

import authController from "../controllers/authController.js";
import tokenAuthentication from "../middleware/tokenAuthentication.js";

const router = Router();

router.get("/protected", tokenAuthentication, (req, res) => {
  res.send("hello user");
});

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/reset-password", authController.resetPassword);

router.post("/new-password", authController.newPassword);

export default router;
