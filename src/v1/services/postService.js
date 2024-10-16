const PostModel = require("../models/post");

const createNewPost = async (post) => {
  return await PostModel.create(post);
};

const deleteOnePost = async (post, userId) => {
  try {
    const onePost = await PostModel.findOne(post).populate("postedBy", "_id");

    if (!onePost) return { error: "Post not found", status: 404 };

    if (onePost.postedBy._id.toString() !== userId.toString())
      return { error: "Unauthorized action", status: 403 };

    const result = await onePost.remove();
    return result;
  } catch (error) {
    console.error("Error in deletePostById:", error);
    throw new Error("Internal Server Error");
  }
};

const getAllPosts = async (page = 1, limit = 10) => {
  return await PostModel.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);
};

module.exports = {
  createNewPost,
  deleteOnePost,
  getAllPosts,
};
// return await PostModel.findOne({ _id: req.params.postId })
//   .populate("postedBy", "_id")
//   .exec((err, post) => {
//     if (err || !post) {
//       return res.status(422).json({ error: err });
//     }
//     if (post.postedBy._id.toString() === req.user._id.toString()) {
//       post
//         .remove()
//         .then((result) => {
//           res.json(result);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   });
