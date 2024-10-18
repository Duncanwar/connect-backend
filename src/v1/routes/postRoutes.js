import { Router } from "express";
const router = Router();

import postController from "../controllers/postController.js";
import tokenAuthentication from "../middleware/tokenAuthentication.js";

router.get("/", postController.getAllPosts);

router.post("/", tokenAuthentication, postController.createNewPost);

router.delete("/:postId", tokenAuthentication, postController.deleteOnePost);

router.get(
  "/followingpost",
  tokenAuthentication,
  postController.getAllFollowingPost
);

router.get("/myposts", tokenAuthentication, postController.getMyPosts);

router.put("/unlike", tokenAuthentication, postController.unLikePost);

router.put("/like", tokenAuthentication, postController.likePost);

router.put(
  "/comment",
  tokenAuthentication,
  postController.updateOnePostWithComment
);

export default router;
