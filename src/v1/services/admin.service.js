const adminSchema = require("../models/admin");

export default class AdminService {
  static async create(admin) {
    return await adminSchema.create(admin);
  }

  static async findAll() {
    return await adminSchema.find();
  }

  static async findOneByUsername(username) {
    return adminSchema.findOne({ username: username });
  }
}
