const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const postSchema = new Schema({
  title: {
    type: String
  },
  subTitle: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
