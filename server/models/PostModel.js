const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Post = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
  },
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  username: {
    type: String,
  },
  user: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Post", Post);
