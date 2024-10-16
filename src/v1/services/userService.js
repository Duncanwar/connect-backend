const UserModel = require("../models/User");

const createNewUser = async (...userData) => {
  return await UserModel.create(userData);
};

const deleteOneUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

const getOneUser = async (data) => {
  return UserModel.findOne(data);
};

const updateOneUser = async (...userData) => {
  return UserModel.save(userData);
};

module.exports = {
  createNewUser,
  deleteOneUser,
  getOneUser,
  updateOneUser,
};
