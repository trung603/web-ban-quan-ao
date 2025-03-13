import express from "express";
import Favorite from "../models/Favorite.js";
import Product from "../models/productModel.js"; // Đảm bảo đường dẫn này đúng

const router = express.Router();

// API thêm sản phẩm vào danh sách yêu thích
router.post("/", async (req, res) => {
  const { productId, userId } = req.body;

  try {
    console.log("Nhận request thêm yêu thích:", req.body);

    // Kiểm tra sản phẩm có trong danh sách yêu thích chưa
    const existingFavorite = await Favorite.findOne({ "product._id": productId, userId });
    if (existingFavorite) {
      return res.status(400).json({ message: "Sản phẩm đã có trong danh sách yêu thích." });
    }

    // Lấy thông tin sản phẩm từ DB
    const product = await Product.findById(productId).lean(); // Dùng `lean()` để tối ưu truy vấn
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    console.log("Thông tin sản phẩm:", product);

    // Tạo bản ghi yêu thích mới
    const newFavorite = new Favorite({
      userId,
      product,
    });

    await newFavorite.save();
    res.status(201).json({ message: "Đã thêm vào danh sách yêu thích.", favorite: newFavorite });
  } catch (error) {
    console.error("Lỗi khi thêm vào danh sách yêu thích:", error);
    res.status(500).json({ message: "Lỗi server.", error });
  }
});

// API lấy danh sách yêu thích của người dùng
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const favorites = await Favorite.find({ userId });
    res.json({ success: true, favorites });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu thích:", error);
    res.status(500).json({ message: "Lỗi server.", error });
  }
});

// API xóa sản phẩm khỏi danh sách yêu thích
router.delete("/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const deletedFavorite = await Favorite.findOneAndDelete({ "product._id": productId, userId });
    if (!deletedFavorite) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong danh sách yêu thích." });
    }
    res.status(200).json({ message: "Đã xóa khỏi danh sách yêu thích." });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm yêu thích:", error);
    res.status(500).json({ message: "Lỗi server.", error });
  }
});

export default router;
