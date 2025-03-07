import express from "express";
import { addComment, getComments, likeComment, updateComment, deleteComment, getAllComments } from "../controllers/commentController.js";

const commentrouter = express.Router();

commentrouter.post("/:productId", addComment);

commentrouter.get("/getallcomment", getAllComments);
commentrouter.get("/:productId", getComments);
commentrouter.patch("/like/:commentId", likeComment);
commentrouter.put("/:commentId", updateComment);
commentrouter.delete("/:commentId", deleteComment); 

export default commentrouter;
