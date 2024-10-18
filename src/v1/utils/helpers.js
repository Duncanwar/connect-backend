import { compare, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

//Generic Error Handling wrapper
const catchAsyncErrors = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error("Error:", error);
    return errorResponse(res, serverError, "Internal Server Error");
  }
};

const comparePassword = async (inputPassword, storedPassword) => {
  try {
    return await compare(inputPassword, storedPassword);
  } catch (error) {
    console.error("Error comparing password", error);
    throw new Error("Password comparison failed");
  }
};

const generateToken = (user, expiresIn = "8h") => {
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn });
};

const hashPassword = async (password) => {
  try {
    return hashSync(password, 15);
  } catch (error) {
    console.error("Error hashing password", error);
    throw new Error("Password hashing failed");
  }
};

const validateRequiredFields = (fields) => {
  return fields.every((field) => !!field);
};

export {
  catchAsyncErrors,
  comparePassword,
  generateToken,
  hashPassword,
  validateRequiredFields,
};
