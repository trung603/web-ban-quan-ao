import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
  clearCart
} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.get("/:userId", authUser, getUserCart);
cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/update", authUser, updateCart);
cartRouter.delete("/:userId", clearCart);

export default cartRouter;
