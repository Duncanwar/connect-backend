import PostModel from "../models/post.js";

const createNewPost = async (post) => {
  return await PostModel.create(post);
};

const deleteOnePost = async (post) => {
  return PostModel.deleteOne(post);
};

const getAllPosts = async (page = 1, limit = 10) => {
  return await PostModel.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

const getAllFollowingPost = async (condition) => {
  return await PostModel.find(condition)
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt");
};

const getMyPosts = async (condition) => {
  return await PostModel.find(condition).populate("PostedBy", "_id name photo");
};

const getOnePost = async (post) => {
  return await PostModel.findOne(post).populate("postedBy", "_id");
};

const updateOnePostLike = async (postId, userId) => {
  return await PostModel.findByIdAndUpdate(
    postId,
    {
      $push: { likes: userId },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name");
};

const updateOnePostUnLike = async (postId, userId) => {
  return await PostModel.findByIdAndUpdate(
    postId,
    {
      $pull: { likes: userId },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name");
};

const updateOnePostWithComment = async (postId, ...comment) => {
  await PostModel.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name");
};

export default {
  createNewPost,
  deleteOnePost,
  getAllPosts,
  getAllFollowingPost,
  getMyPosts,
  getOnePost,
  updateOnePostLike,
  updateOnePostUnLike,
  updateOnePostWithComment,
};
