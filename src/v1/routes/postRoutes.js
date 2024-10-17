const express = require("express");
const router = express.Router();

const Post = require("../models/post");
const postControllers = require("../controllers/postController");
const requiredLogin = require("../middleware/requireLogin");

router.get("/", postControllers.getAllPosts);

router.post("/", requiredLogin, postControllers.createNewPost);

router.delete("/:postId", requiredLogin, postControllers.deleteOnePost);

router.get(
  "/followingpost",
  requiredLogin,
  postControllers.getAllFollowingPost
);

router.get("/myposts", requiredLogin, postControllers.getMyPosts);

router.put("/unlike", requiredLogin, postControllers.unLikePost);

router.put("/like", requiredLogin, postControllers.likePost);

router.put("/comment", requiredLogin, postControllers.updateOnePostWithComment);

module.exports = router;
