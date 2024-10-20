import { createTransport } from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
import { randomBytes } from "crypto";

import { errorResponse, successResponse } from "../utils/responses.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
  validateRequiredFields,
} from "../utils/helpers.js";
import userService from "../services/userService.js";
import {
  ok,
  created,
  unprocessableEntity,
  serverError,
} from "../utils/statusCode.js";
import {
  emailExist,
  signedup,
  missingFields,
  authError,
  emailAssociate,
} from "../utils/customMessage.js";

const transporter = createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!validateRequiredFields([email, password]))
    return errorResponse(res, unprocessableEntity, missingFields);

  try {
    const user = await userService.getOneUser({ email: email });

    if (!user || !comparePassword(password, user.password))
      return errorResponse(res, unprocessableEntity, authError);

    const token = generateToken(user);
    return successResponse(res, ok, token, "You have logged in successfully", {
      user: user,
    });
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

    const hashedPassword = hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.expireToken = undefined;
    await userService.updateOneUser(user);
  } catch (error) {
    console.error(error);
    return errorResponse(res, serverError, "Internal Server Error");
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!validateRequiredFields([email]))
    return errorResponse(res, unprocessableEntity, missingFields);

  try {
    const user = await userService.getOneUser({ email: email });
    if (!user) return errorResponse(res, unprocessableEntity, emailAssociate);

    const token = randomBytes(32).toString("hex");
    user.resetToken = token;
    user.expireToken = Date.now() + 3600000;
    await userService.updateOneUser(user);

    await userService.transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_SENDER,
      subject: "Signup",
      html: `
            <p>You requested for password reset</p>
            <h5>click in this <a href="${process.env.FRONT_END_URL}/reset/${token}">link</a> to reset password</h5>
            `,
    });
    return successResponse(
      res,
      ok,
      null,
      "Check your email for password reset link."
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, serverError, "Internal Server Error");
  }
};

const signup = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!validateRequiredFields([name, email, password, pic]))
    return errorResponse(res, unprocessableEntity, missingFields);

  try {
    const userExists = await userService.getOneUser({ email: email });
    if (userExists) return errorResponse(res, unprocessableEntity, emailExist);

    const hashedPassword = hashPassword(password);
    await userService.createNewUser({
      name,
      email,
      password: hashedPassword,
      photo: pic,
    });

    return successResponse(res, created, null, signedup);
  } catch (error) {
    console.error(error);
    return errorResponse(res, serverError, "Signup failed. Please try again.");
  }
};

export default {
  login,
  newPassword,
  resetPassword,
  signup,
};
