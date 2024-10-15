const bcrypt = require("bcrypt");

const userService = require("../services/userService");

const createNewUser = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ message: "please add all fields" });
  }
  const userExist = await userService.getOneUser(email);
  if (userExist)
    return res
      .status(422)
      .json({ message: "user already exists with that email" });

  const hashedPassword = await bcrypt.hash(password, 12);
  console.log("passed");

  const user = await userService.createNewUser({
    name,
    email,
    hashedPassword,
    pic,
  });
  console.log("done");
  // await user.save();
  return res.json({ message: "saved successfully" });
};

module.exports = {
  createNewUser,
};
