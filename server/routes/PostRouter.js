const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Post = require("../models/PostModel");

router.get("/allPost", auth, async (req, res) => {
  Post.find().then((posts) => res.status(200).json(posts));
});

router.get("/singlePost/:id", auth, async (req, res) => {
  Post.findOne({ postId: req.params.id }, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.json(posts);
    }
  });
});

router.get("/mypost", auth, async (req, res) => {
  await Post.find({ user: req.user._id }, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.json(posts);
    }
  });
});

router.post("/", auth, async (req, res) => {
  let { postId, title, username } = req.body;
  if (!title) {
    res.status(400).json({
      message: "Please enter all fields",
    });
  }
  const post = new Post({
    postId,
    title,
    createdAt: new Date().toISOString(),
    username,
    user: req.user,
  });
  const savePost = await post.save();
  req.user.password = undefined;
  req.user.repeatPassword = undefined;
  res.json(savePost);
});

router.put("/update/:id", auth, async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, req.body, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json({
        message: "Successfully updated",
      });
    }
  });
});

router.delete("/delete/:id", auth, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json({
        message: "Successfully deleted",
      });
    }
  });
});

router.put("/like/:id", auth, async (req, res) => {
  const user = req.user;
  const username = user.username;
  const post = await Post.findOne({ postId: req.params.id });

  if (post) {
    if (post.likes.find((like) => like.username === username)) {
      post.likes = post.likes.filter((like) => like.username != username);
      res.send("You already liked");
      await post.save();
    } else {
      post.likes.push({
        username,
        createdAt: new Date().toISOString(),
      });
    }
    res.send("You liked");
    await post.save();
    return post;
  } else {
    res.status("400").send("Post not found");
  }
});

router.put("/comment/:id", auth, async (req, res) => {
  const newComment = {
    title: req.body.title,
    username: req.user.username,
    createdAt: new Date().toISOString(),
  };
  await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: newComment },
  }).exec((err, result) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
