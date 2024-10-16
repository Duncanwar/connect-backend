const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
require("dotenv").config();

const authController = require("../controllers/authController");
const requireLogin = require("../middleware/requireLogin");
const User = require("../models/User");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

router.get("/protected", requireLogin, (req, res) => {
  res.send("hello user");
});

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) console.log(err);
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user)
        return res
          .status(422)
          .json({ error: "User with that email does not exist" });
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: process.env.EMAIL_SENDER,
          subject: "Signup",
          html: `
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="${process.env.FRONT_END_URL}/reset/${token}">link</a> to reset password</h5>
                    `,
        });
        res.json({ message: "check your email" });
      });
    });
  });
});

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
