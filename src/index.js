const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const app = express();
require("./v1/config/dbConfig");

const PORT = process.env.PORT || 8000;
const v1PostRouter = require("./v1/routes/postRoutes");
const v1AuthRouter = require("./v1/routes/authRoutes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1", v1AuthRouter);
app.use("/api/v1/posts", v1PostRouter);

app.get("/", (req, res) => res.json({ message: "done" }));

app.listen(PORT, () => {
  console.log("server is running on,PORT", PORT);
});
