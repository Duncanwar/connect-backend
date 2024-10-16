const express = require("express");
const router = express.Router();
require("dotenv").config();

const authController = require("../controllers/authController");
const requireLogin = require("../middleware/requireLogin");

router.get("/protected", requireLogin, (req, res) => {
  res.send("hello user");
});

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/reset-password", authController.resetPassword);

router.post("/new-password", authController.newPassword);

module.exports = router;
