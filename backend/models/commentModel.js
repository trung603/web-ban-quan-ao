import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  user: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CommentSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  user: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  likes: { type: Number, default: 0 },
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
