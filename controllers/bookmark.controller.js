const BookmarkService = require("../services/bookmark.service");

export default class BookmarkController {
  static async add(req, res) {
    let bookmark = { postedId: req.body.postId, bookmarkedBy: req.user._id };
    try {
      bookmark = await BookmarkService.create(bookmark);
      res.json({ message: "done", bookmark });
    } catch (err) {
      throw new Error(err);
    }
  }
  static async getBookMarkedPostByUserId(req, res) {
    const bookmark = await BookmarkService.findAllByUser(req);
    res.json({ bookmark });
  }
}
