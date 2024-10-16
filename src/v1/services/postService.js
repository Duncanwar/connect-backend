const PostModel = require("../models/post");

const createNewPost = async (post) => {
  return await PostModel.create(post);
};

const getAllPosts = async (page = 1, limit = 10) => {
  return await PostModel.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);
};

module.exports = {
  createNewPost,
  getAllPosts,
};
