import Comment from "../models/commentModel.js";
import mongoose from "mongoose";

// Thêm bình luận mới
const addComment = async (req, res) => {
    try {
      console.log("Nhận request thêm bình luận:", req.body);
  
      const { productId } = req.params;
      const { userId, user, text, rating } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
      }

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "productId không hợp lệ!" });
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "userId không hợp lệ!" });
      }

      const newComment = new Comment({
        productId,
        userId,
        user,
        text,
        rating,
        likes: 0,
        replies: [],
        createdAt: new Date(),
      });

      await newComment.save();
      res.status(201).json(newComment);
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
      res.status(500).json({ message: "Lỗi server", error });
    }
};
  
// Lấy danh sách bình luận của một sản phẩm
const getComments = async (req, res) => {
    try {
      const comments = await Comment.find().sort({ createdAt: -1 });
      res.status(200).json(comments);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bình luận:", error);
      res.status(500).json({ message: "Lỗi server", error });
    }
  };
  

// Like một bình luận
const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "commentId không hợp lệ!" });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại" });
    }
    comment.likes += 1;
    await comment.save();
    res.status(200).json({ message: "Đã thích bình luận", likes: comment.likes });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Thêm phản hồi vào bình luận
const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, user, text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "commentId không hợp lệ!" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId không hợp lệ!" });
    }
    if (!text || typeof text !== "string") {
      return res.status(400).json({ message: "Nội dung phản hồi không hợp lệ!" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại" });
    }
    
    comment.replies.push({ userId, user, text, createdAt: new Date() });
    await comment.save();
    
    res.status(201).json({ message: "Đã phản hồi bình luận", comment });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export { replyToComment, likeComment, getComments, addComment };
