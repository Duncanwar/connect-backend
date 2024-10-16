const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const comparePassword = (inputPassword, storedPassword) => {
  return bcrypt.compare(inputPassword, storedPassword);
};

const generateToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 15);
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
