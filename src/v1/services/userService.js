const UserModel = require("../models/User");

const createNewUser = async (...userData) => {
  return await UserModel.create(userData);
};

const deleteOneUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

const getOneUser = async (email) => {
  return UserModel.findOne({ email: email });
};

module.exports = {
  createNewUser,
  deleteOneUser,
  getOneUser,
};
