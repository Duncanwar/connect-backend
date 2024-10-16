const bcrypt = require("bcrypt");

const { errorResponse, successResponse } = require("../utils/responses");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/helpers");
const userService = require("../services/userService");
const { ok, created, unprocessableEntity } = require("../utils/statusCode");
const {
  emailExist,
  signup,
  missingFields,
  authError,
} = require("../utils/customMessage");

const signup = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ message: "please add all fields" });
  }
  const userExist = await userService.getOneUser(email);
  if (userExist) return errorResponse(res, unprocessableEntity, emailExist);

  const hashedPassword = hashPassword(password);

  await userService.createNewUser({
    name,
    email,
    password: hashedPassword,
    photo: pic,
  });
  return successResponse(res, created, null, signup, null);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return errorResponse(res, unprocessableEntity, missingFields);
  }
  const user = await userService.getOneUser(email);
  if (!user) return errorResponse(res, unprocessableEntity, authError);

  const boolPassword = comparePassword(password, user.password);
  if (boolPassword) {
    const token = generateToken(user);
    return successResponse(
      res,
      ok,
      token,
      "You have logged in successfully",
      user
    );
  }

  //   bcrypt
  //     .compare(password, user.password)
  //     .then((doMatch) => {
  //       if (doMatch) {
  //         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  //         const { _id, name, email, followers, following, photo } = user;
  //         return res.json({
  //           token,
  //           user: { _id, name, email, followers, following, photo },
  //           message: "successfully signed in",
  //         });
  //       } else {
  //         return res.status(422).json({ error: "Invalid Email or password" });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
};

module.exports = {
  login,
  signup,
};
