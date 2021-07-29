const UserModel = mongoose.model("../models/user");

export default class UserService {
  static async create() {}

  static async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }
}
