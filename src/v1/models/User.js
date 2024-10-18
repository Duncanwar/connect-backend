import mongoose from "mongoose";

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes leading and trailing spaces
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email uniqueness
    trim: true,
    lowercase: true, // Saves email in lowercase to avoid case-sensitive issues
  },
  resetToken: String,
  expireToken: Date,
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default:
      "https://res.cloudinary.com/semugeshi/image/upload/v1590387633/sample.jpg",
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
});

export default model("User", userSchema);
