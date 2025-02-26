import express from "express";
import Favorite from "../models/Favorite.js"; // Đảm bảo rằng bạn có model Favorite

// Khai báo router trước khi sử dụng
const router = express.Router();

// Route để thêm sản phẩm vào danh sách yêu thích
router.post("/", async (req, res) => {
  const { productId } = req.body;
  try {
    const existingFavorite = await Favorite.findOne({ productId });
    if (existingFavorite) {
      return res.status(400).json({ message: "Sản phẩm đã có trong danh sách yêu thích." });
    }
    const newFavorite = new Favorite({ productId });
    await newFavorite.save();
    res.status(201).json({ message: "Đã thêm vào danh sách yêu thích.", favorite: newFavorite });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm vào danh sách yêu thích.", error });
  }
});

// Route để xóa sản phẩm khỏi danh sách yêu thích
router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const deletedFavorite = await Favorite.findOneAndDelete({ productId });
    if (!deletedFavorite) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong danh sách yêu thích." });
    }
    res.status(200).json({ message: "Đã xóa khỏi danh sách yêu thích." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa khỏi danh sách yêu thích.", error });
  }
});

// Xuất router để sử dụng trong server.js
export default router;
