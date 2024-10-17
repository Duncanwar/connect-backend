const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const comparePassword = async (inputPassword, storedPassword) => {
  try {
    return await bcrypt.compare(inputPassword, storedPassword);
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
    return bcrypt.hashSync(password, 15);
  } catch (error) {
    console.error("Error hashing password", error);
    throw new Error("Password hashing failed");
  }
};

const validateRequiredFields = (fields) => {
  return fields.every((field) => !!field);
};

module.exports = {
  comparePassword,
  generateToken,
  hashPassword,
  validateRequiredFields,
};
