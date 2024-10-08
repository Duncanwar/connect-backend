const express = require("express");
const router = express.Router();

// const admin = require("./adminRoutes");
// const auth = require("./authRoutes");
// const bookmark = require("./bookmarkRoutes");
// const post = require("./postRoutes");
// const user = require("./userRoutes");
router.route("/").get((req, res) => {
  res.send(`<h2>Hello from ${req.baseUrl}</h2>`);
});

module.exports = router;
