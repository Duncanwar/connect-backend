const PostSchema = require("../models/post");

module.exports = class PostService {
  static async create(post) {
    return await PostSchema.create(post);
  }
  static async findAll() {
    return await PostSchema.find()
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt");
  }
};
