const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const { errorResponse, successResponse } = require("../utils/responses");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/helpers");
const userService = require("../services/userService");
const {
  ok,
  created,
  unprocessableEntity,
  serverError,
} = require("../utils/statusCode");
const {
  emailExist,
  signedup,
  missingFields,
  authError,
  emailAssociate,
} = require("../utils/customMessage");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const validateRequiredFields = (fields) => {
  return fields.every((field) => !!field);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!validateRequiredFields([email, password])) {
    return errorResponse(res, unprocessableEntity, missingFields);
  }
  try {
    const user = await userService.getOneUser({ email: email });
    if (!user) return errorResponse(res, unprocessableEntity, authError);
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid)
      return errorResponse(res, unprocessableEntity, authError);
    const token = generateToken(user);
    return successResponse(
      res,
      ok,
      token,
      "You have logged in successfully",
      user
    );
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      serverError,
      "Login failed. Please try again later."
    );
  }
};

const newPassword = async (req, res) => {
  const { password, token } = req.body;

  if (!validateRequiredFields([password, token]))
    return errorResponse(res, unprocessableEntity, missingFields);

  try {
    const user = await userService.getOneUser({
      resetToken: sentToken,
      expireToken: { $gt: Date.now() },
    });
    if (!user)
      return errorResponse(
        res,
        unprocessableEntity,
        "Session expired. Try again session expired"
      );
    const passwordHash = hashPassword(newPassword);
    user.password = passwordHash;
    user.resetToken = undefined;
    user.expireToken = undefined;
    await userService.updateOneUser(user);
  } catch (error) {
    console.error(error);
    return errorResponse(res, serverError, "Internal Server Error");
  }
};

const resetPassword = async (req, res) => {
  try {
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString("hex");

    const user = await userService.getOneUser({ email: req.body.email });
    if (!user) return errorResponse(res, unprocessableEntity, emailAssociate);

    user.resetToken = token;
    user.expireToken = Date.now() + 3600000;

    await userService.updateOneUser(user);

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_SENDER,
      subject: "Signup",
      html: `
            <p>You requested for password reset</p>
            <h5>click in this <a href="${process.env.FRONT_END_URL}/reset/${token}">link</a> to reset password</h5>
            `,
    });
    res.json({ message: "check your email for password reset link" });
  } catch (error) {
    console.log(error);
    errorResponse(res, serverError, "Internal Server Error");
  }
};

const signup = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ message: "please add all fields" });
  }
  const userExist = await userService.getOneUser({ email: email });
  if (userExist) return errorResponse(res, unprocessableEntity, emailExist);

  const hashedPassword = hashPassword(password);

  await userService.createNewUser({
    name,
    email,
    password: hashedPassword,
    photo: pic,
  });
  return successResponse(res, created, null, signedup, null);
};

module.exports = {
  login,
  newPassword,
  resetPassword,
  signup,
};
