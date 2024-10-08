const postService = require("../services/post.service");
const Post = require("../models/post");

const createNewPost = async (req, res) => {
  const { title, body, pic } = req.body;
  let post = { photo: pic, postedBy: req.user, ...req.body };
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  post = await postService.createNewPost(post);
  req.user.password = undefined;
  return res.json({ post });
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
