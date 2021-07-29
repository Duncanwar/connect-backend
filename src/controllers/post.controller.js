const PostService = require("../services/post.service");

const { findAll, create } = PostService;
module.exports = class PostControllers {
  static async getAll(req, res) {
    try {
      const posts = await findAll();
      return res.json({ posts });
    } catch (err) {
      console.log(err);
    }
  }
  static async createPost(req, res) {
    const { title, body, pic } = req.body;
    let post = { photo: pic, postedBy: req.user, ...req.body };
    if (!title || !body || !pic) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    post = await create(post);
    req.user.password = undefined;
    return res.json({ post });
  }
};
