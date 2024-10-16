const postService = require("../services/postService");
const Post = require("../models/post");
const { validateRequiredFields } = require("../utils/helpers");
const { errorResponse, successResponse } = require("../utils/responses");
const { unprocessableEntity, serverError } = require("../utils/statusCode");

const createNewPost = async (req, res) => {
  const { title, body, pic } = req.body;
  if (!validateRequiredFields([body, title, pic]))
    return errorResponse(res, unprocessableEntity);
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
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPost();
    return res.json({ posts });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createNewPost,
  getAllPosts,
  deleteOnePost,
};
