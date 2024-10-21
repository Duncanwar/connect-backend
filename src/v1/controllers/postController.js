import postService from "../services/postService.js";
import { catchAsyncErrors, validateRequiredFields } from "../utils/helpers.js";
import {
  errorResponse,
  successResponse,
  retrieveResponse,
} from "../utils/responses.js";
import { unprocessableEntity, ok } from "../utils/statusCode.js";
import { missingFields } from "../utils/customMessage.js";

const createNewPost = catchAsyncErrors(async (req, res) => {
  const { title, body, pic } = req.body;

  if (!validateRequiredFields([body, title, pic]))
    return errorResponse(res, unprocessableEntity, missingFields);
  const post = await postService.createNewPost({
    photo: pic,
    postedBy: req.user,
    ...req.body,
  });

  return successResponse(res, 201, undefined, "Created New Post", post);
});

const deleteOnePost = catchAsyncErrors(async (req, res) => {
  const { postId } = req.params;

  if (!validateRequiredFields([postId]))
    return errorResponse(res, unprocessableEntity, missingFields);

  const post = await getOnePost({
    _id: postId,
  });

  if (!post)
    return errorResponse(res, unprocessableEntity, "The post is not available");

  if (post.postedBy.id.toString() !== req.user.id.toString())
    return errorResponse(
      res,
      unprocessableEntity,
      "You are not authorized to delete this post"
    );

  const result = await postService.deleteOnePost({ _id: postId });
  return successResponse(res, ok, null, "Deleted post", result);
});

const getAllFollowingPost = catchAsyncErrors(async (req, res) => {
  const followPost = await postService.getAllFollowingPost({
    postedBy: { $in: req.user.following },
  });
  return successResponse(res, ok, followPost);
});

const getAllPosts = catchAsyncErrors(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const allPosts = await postService.getAllPosts(page, limit);
  return retrieveResponse(res, ok, allPosts);
});

const getMyPosts = catchAsyncErrors(async (req, res) => {
  const myposts = await postService.getMyPosts({ postedBy: req.user._id });
  return retrieveResponse(res, ok, myposts);
});

const likePost = catchAsyncErrors(async (req, res) => {
  const { postId } = req.body;
  const liked = await updateOnePostLike(postId, req.user.id);
  return retrieveResponse(res, ok, liked);
});

const unLikePost = catchAsyncErrors(async (req, res) => {
  const { postId } = req.body;
  const unLiked = await updateOnePostUnLike(postId, req.user.id);
  return retrieveResponse(res, ok, unLiked);
});

const updateOnePostWithComment = catchAsyncErrors(async (req, res) => {
  const comment = { text: req.body.text, postedBy: req.user.postService.id };
  const postComment = await postService.updateOnePostWithComment(
    req.body.postId,
    comment
  );
  return retrieveResponse(res, ok, postComment);
});

export default {
  createNewPost,
  deleteOnePost,
  getAllFollowingPost,
  getAllPosts,
  getMyPosts,
  likePost,
  unLikePost,
  updateOnePostWithComment,
};
