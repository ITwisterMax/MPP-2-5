const express = require('express');
const post = require('../controllers/post');
const {requireSignin} = require('../controllers/auth');

const postRouter = express.Router();

postRouter.post('/create', requireSignin, post.createPost);

postRouter.get('/posts', requireSignin, post.showPosts);

module.exports = postRouter;