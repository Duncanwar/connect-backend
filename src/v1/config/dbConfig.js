import mongoose from "mongoose";
require("dotenv").config();

const dbUrl = process.env.MONGOURI;

const connectDB = async () => {
  try {
    mongoose.connect(dbUrl);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};
connectDB();
const db = mongoose.connection;

export default db;
// mFpYrfJU42u2tJwu
