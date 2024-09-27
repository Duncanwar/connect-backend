const express = require('express')
const router  = express.Router();
const requireLogin = require('../middleware/requireLogin')
import BookmarkController from "../controllers/bookmark.controller";

router.post('/bookmark', requireLogin, BookmarkController.add);
router.get('/bookmark', requireLogin, BookmarkController.getBookMarkedPostByUserId)

module.exports = router;
