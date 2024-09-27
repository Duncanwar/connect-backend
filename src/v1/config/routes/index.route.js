const express = require('express')
const auth = require('./auth')
const post = require('./post')
const user = require('./user')
const chat = require('./chat')
const admin = require('./admin')
const bookmark = require('./bookmark')

const router = express.Router();

router.use('/',auth)
router.use('/',post)
router.use('/',user)
router.use('/',chat);
router.use('/',admin)
router.use('/', bookmark)

module.exports = router;
