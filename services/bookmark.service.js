const BookmarkSchema = require("../models/bookmark");

export default class PostService {
  static async create(post) {
    return await BookmarkSchema.create(post);
  }
  static async findAllByUser(req) {
    return await BookmarkSchema.find({ bookmarkedBy: req.user._id })
      .populate("bookmarkedBy", "_id name")
      .populate("postedId", "_id title body photo likes comments")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt");
  }
}
