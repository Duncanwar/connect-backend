const UserModel = require("../models/User");

const createNewUser = async (...userData) => {
  // console.log(userData);
  const user = new UserModel({
    email: userData.email,
    password: userData.hashedPassword,
    name: userData.name,
    photo: userData.pic,
  });

  return await user.save(user);
};

const deleteOneUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

const getOneUser = async (email) => {
  console.log(email);
  return UserModel.findOne({ email: email });
};

module.exports = {
  createNewUser,
  deleteOneUser,
  getOneUser,
};
