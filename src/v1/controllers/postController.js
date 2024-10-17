const postService = require("../services/postService");
const { validateRequiredFields } = require("../utils/helpers");
const {
  errorResponse,
  successResponse,
  retrieveResponse,
} = require("../utils/responses");
const { unprocessableEntity, serverError, ok } = require("../utils/statusCode");
const { missingFields } = require("../utils/customMessage");

const createNewPost = async (req, res) => {
  const { title, body, pic } = req.body;

  if (!validateRequiredFields([body, title, pic]))
    return errorResponse(res, unprocessableEntity, missingFields);

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
    const post = await postService.getOnePost({
      _id: postId,
    });
    if (!post)
      return errorResponse(
        res,
        unprocessableEntity,
        "the post is not available"
      );
    if (post.postedBy._id.toString() !== req.user._id.toString())
      return errorResponse(
        res,
        unprocessableEntity,
        "the post is not available for delete"
      );
    const result = await postService.deleteOnePost({ _id: postId });
    return successResponse(res, ok, null, "deleted post", result);
  } catch (error) {
    console.error("Error deleting post:", error);
    return errorResponse(res, serverError, "Internal Server Error");
  }
};

const getAllFollowingPost = async (req, res) => {
  try {
    const followPost = await postService.getAllFollowingPost({
      postedBy: { $in: req.user.following },
    });
    return successResponse(res, ok, followPost);
  } catch (error) {
    console.error("Error getting the post I follow:", error);
    return errorResponse(res, serverError, "Internal Server Error");
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await postService.getAllPosts();
    return retrieveResponse(res, ok, allPosts);
  } catch (error) {
    console.error("Error getting my posts post:", error);
    return errorResponse(res, serverError, "Internal Server Error");
  }
};

const getMyPosts = async (req, res) => {
  try {
    const myposts = await postService.getMyPosts({ postedBy: req.user._id });
    return retrieveResponse(res, ok, myposts);
  } catch (error) {
    console.error("Error getting my posts post:", error);
    return errorResponse(res, serverError, "Internal Server Error");
  }
};

const likePost = async (req, res) => {
  const { postId } = req.body;
  try {
    const liked = await postService.updateOnePostLike(postId, req.user._id);
    console.log(liked);
    return retrieveResponse(res, ok, liked);
  } catch (error) {
    console.error("Liking Post Failed", error);
    return errorResponse(res, serverError, "Internal Server Error");
  }
};

const unLikePost = async (req, res) => {
  const { postId } = req.body;
  try {
    const unLiked = await postService.updateOnePostUnLike(postId, req.user._id);
    return retrieveResponse(res, ok, unLiked);
  } catch (error) {
    console.error("UnLiking Post Failed", error);
    return errorResponse(res, serverError, "Internal Server Error");
  }
};

const updateOnePostWithComment = async (req, res) => {
  const comment = { text: req.body.text, postedBy: req.user._id };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

module.exports = {
  createNewPost,
  deleteOnePost,
  getAllFollowingPost,
  getAllPosts,
  getMyPosts,
  likePost,
  unLikePost,
  updateOnePostWithComment,
};
