import cors from "cors";
import express from "express";

import "./v1/config/dbConfig.js";
import route from "./v1/routes/index.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api/v1", route);

app.get("/", (req, res) => res.json({ message: "done" }));

app.listen(PORT, () => {
  console.log("server is running on,PORT", PORT);
});
