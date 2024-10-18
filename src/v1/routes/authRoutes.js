import { Router } from "express";
require("dotenv").config();

import {
  signup,
  login,
  resetPassword,
  newPassword,
} from "../controllers/authController.js";
import tokenAuthentication from "../middleware/tokenAuthentication.js";

const router = Router();

router.get("/protected", tokenAuthentication, (req, res) => {
  res.send("hello user");
});

router.post("/signup", signup);

router.post("/login", login);

router.post("/reset-password", resetPassword);

router.post("/new-password", newPassword);

export default router;
