const postService = require("../services/postService");
const Post = require("../models/post");
const { validateRequiredFields } = require("../utils/helpers");
const { errorResponse, successResponse } = require("../utils/responses");
const { unprocessableEntity, serverError, ok } = require("../utils/statusCode");
const { missingFields } = require("../utils/customMessage");

const createNewPost = async (req, res) => {
  const { title, body, pic } = req.body;

  if (!validateRequiredFields([body, title, pic]))
    return errorResponse(res, unprocessableEntity, missingFields);
  console.log(title, "here");
  try {
    const post = await postService.createNewPost({
      photo: pic,
      postedBy: req.user,
      ...req.body,
    });
    req.user.password = undefined;

    return successResponse(res, 201, undefined, "Created New Post", post);
  } catch (error) {
    console.error(error);
    return errorResponse(res, serverError, error);
  }
};

const deleteOnePost = async (req, res) => {
  const { postId } = req.params;

  if (!validateRequiredFields([postId]))
    return errorResponse(res, unprocessableEntity, missingFields);

  try {
    const result = await postService.deleteOnePost(postId, req.user._id);
    if (!result)
      return errorResponse(
        res,
        unprocessableEntity,
        "the post is not available"
      );
    return successResponse(res, ok, null, "deleted post", result);
  } catch {
    console.error("Error deleting post:", error);
    return errorResponse(res, serverError, "Internal Server Error");
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await postService.getAllPosts();
    return successResponse(res, ok, undefined, "Retrieved all posts", allPosts);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createNewPost,
  getAllPosts,
  deleteOnePost,
};
