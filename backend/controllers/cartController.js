import userModel from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import mongoose from "mongoose";
import productModel from "../models/productModel.js";

// 🛒 Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity = 1 } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ!" });
        }

        const objectId = new mongoose.Types.ObjectId(userId);
        let cart = await Cart.findOne({ userId: objectId });

        if (!cart) {
            // Nếu user chưa có giỏ hàng, tạo mới
            cart = new Cart({
                userId: objectId, 
                items: [{ itemId: new mongoose.Types.ObjectId(itemId), size, quantity }],
            });
        } else {
            // Kiểm tra sản phẩm đã có trong giỏ chưa
            const existingItem = cart.items.find(
                (item) => item.itemId.toString() === itemId && item.size === size
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ itemId: new mongoose.Types.ObjectId(itemId), size, quantity });
            }
        }

        await cart.save();
        res.json({ success: true, message: "Thêm sản phẩm vào giỏ hàng thành công!", cart });

    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        res.status(500).json({ success: false, message: "Lỗi khi thêm sản phẩm vào giỏ hàng!", error });
    }
};


// ✏️ Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ!" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Không tìm thấy giỏ hàng!" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.itemId.toString() === itemId && item.size === size
        );

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity; // Cập nhật số lượng
            } else {
                cart.items.splice(itemIndex, 1); // Xóa sản phẩm nếu số lượng = 0
            }
        } else {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
        }

        await cart.save();
        res.json({ success: true, message: "Cập nhật giỏ hàng thành công!", cart });
    } catch (error) {
        console.error("🔥 Lỗi khi cập nhật giỏ hàng:", error);
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật giỏ hàng!", error });
    }
};

// 📦 Lấy giỏ hàng của người dùng
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "userId không hợp lệ!" });
        }

        const cart = await Cart.findOne({ userId }).populate("items.itemId");

        if (!cart) {
            return res.status(200).json({ success: true, cartData: [] });
        }

        let newCartData = [];

        for (let item of cart.items) {
            const productData = await productModel.findOne({ _id: item.itemId });

            if (productData) {
                newCartData.push({
                    _id: productData._id,
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    image: productData.image,
                    category: productData.category,
                    subCategory: productData.subCategory,
                    sizes: productData.sizes,
                    bestseller: productData.bestseller,
                    date: productData.date,
                    quantity: item.quantity,
                    size: item.size,
                });
            }
        }

        res.json({ success: true, cartData: newCartData });

    } catch (error) {
        console.error("🔥 Lỗi khi lấy giỏ hàng:", error);
        res.status(500).json({ success: false, message: "Lỗi khi lấy giỏ hàng!", error });
    }
};

  // ❌ Xóa toàn bộ giỏ hàng của người dùng
const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "ID người dùng không hợp lệ!" });
        }

        const cart = await Cart.findOneAndDelete({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Không tìm thấy giỏ hàng!" });
        }

        res.json({ success: true, message: "Giỏ hàng đã được xóa!" });

    } catch (error) {
        console.error("🔥 Lỗi khi xóa giỏ hàng:", error);
        res.status(500).json({ success: false, message: "Lỗi khi xóa giỏ hàng!", error });
    }
};
  
export { addToCart, updateCart, getUserCart, clearCart};
