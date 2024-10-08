const PostSchema = require("../models/post");

const createNewPost = async (post) => {
  return await PostSchema.create(post);
};

const getAllPost = async () => {
  return await PostSchema.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt");
};

module.exports = {
  createNewPost,
  getAllPost,
};
