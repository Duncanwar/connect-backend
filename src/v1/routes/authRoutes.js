const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const authController = require("../controllers/authController");
const requireLogin = require("../middleware/requireLogin");
const User = require("../models/User");

router.get("/protected", requireLogin, (req, res) => {
  res.send("hello user");
});

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/reset-password", authController.resetPassword);

router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user)
        return res.status(422).json({ error: "Try again session expired" });
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "password updated success" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
