import cors from "cors";
import express from "express";
import { urlencoded, json } from "body-parser";

import "./v1/config/dbConfig.js";
import v1PostRouter from "./v1/routes/postRoutes.js";
import v1AuthRouter from "./v1/routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.use("/api/v1", v1AuthRouter);
app.use("/api/v1/posts", v1PostRouter);

app.get("/", (req, res) => res.json({ message: "done" }));

app.listen(PORT, () => {
  console.log("server is running on,PORT", PORT);
});
