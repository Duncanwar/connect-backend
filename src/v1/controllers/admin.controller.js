const adminService = require("../services/admin.service");
import { config } from "dotenv";

config();

const { create, findAll } = adminService;

export default class AdminController {
  static async createAdmin(req, res) {
    const admin1 = {
      username: req.body.username,
      password: process.env.ADMIN_PASSWORD,
    };

    console.log(admin1);
    const admin = await create(admin1);
    return res.status(200).json({ admin });
  }
  static async getAll(req, res) {
    const admins = await findAll();
    return res.status(200).json({ admins });
  }
  static async deleteUser(req, res) {
    const { userId } = req.params;
  }
}
