const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
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
  followers: [{ type: ObjectId, ref: "user" }],
  following: [{ type: ObjectId, ref: "user" }],
});

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
