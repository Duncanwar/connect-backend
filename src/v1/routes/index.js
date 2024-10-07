const express = require("express");
const router = express.Router();

// const admin = require("./admin");
// const auth = require("./auth");
// const bookmark = require("./bookmark");
// const post = require("./post");
// const user = require("./user");
router.route("/").get((req, res) => {
  res.send(`<h2>Hello from ${req.baseUrl}</h2>`);
});

module.exports = router;
