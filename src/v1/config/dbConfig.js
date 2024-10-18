import mongoose from "mongoose";
import { config } from "dotenv";

config();

const dbUrl = process.env.MONGOURI;

const connectDB = async () => {
  try {
    mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};
connectDB();
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongodb connection error"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
export default db;
// mFpYrfJU42u2tJwu
