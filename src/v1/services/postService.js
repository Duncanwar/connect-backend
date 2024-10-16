const PostModel = require("../models/post");

const createNewPost = async (post) => {
  return await PostModel.create(post);
};

const getAllPosts = async () => {
  return await PostModel.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt");
};

module.exports = {
  createNewPost,
  getAllPosts,
};
