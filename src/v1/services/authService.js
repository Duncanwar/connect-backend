const UserModel = require("../models/User");

const login = async (...userData) => {
  return await UserModel.create(userData);
};

module.exports = {
  createNewUser,
};
