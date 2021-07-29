const dotenv = require("dotenv");
const adminService = require("../services/admin.service");

dotenv.config();
const { findOneByUsername } = adminService;
const checkPassword = (req, res, next) => {
  if (req.body.password != process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "bad password or email" });
  }
  next();
};

const checkUsername = async (req, res, next) => {
  const body = await findOneByUsername(req.username);
  console.log(req.body.username);
  if (!body) {
    return next();
  }
  return res.status(401).json({ error: "bad email or password" });
};
export default {
  checkUsername,
  checkPassword,
};
