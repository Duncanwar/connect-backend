import UserModel from "../models/User.js";

const createNewUser = async (...userData) => {
  return await UserModel.create(userData);
};

const deleteOneUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

const getOneUser = async (data) => {
  console.log(data);
  return await UserModel.findOne(data);
};

const updateOneUser = async (...userData) => {
  return await UserModel.save(userData);
};

export default {
  createNewUser,
  deleteOneUser,
  getOneUser,
  updateOneUser,
};
