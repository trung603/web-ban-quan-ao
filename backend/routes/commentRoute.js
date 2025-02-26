import express from "express";
import { addComment, getComments, likeComment, replyToComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/:productId/add", addComment); // Thêm bình luận
commentRouter.get("/:productId", getComments); // Lấy danh sách bình luận
commentRouter.patch("/:commentId/like", likeComment); // Like bình luận
commentRouter.post("/:commentId/reply", replyToComment); // Phản hồi bình luận

export default commentRouter;
