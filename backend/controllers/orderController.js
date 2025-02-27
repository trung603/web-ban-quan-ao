import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import cartModel from "../models/cartModel.js";
import Stripe from "stripe";
import mongoose from "mongoose";

// Biến toàn cục
const currency = "USD"; // Đơn vị tiền tệ
const deliveryCharge = 10; // Phí vận chuyển

// Khởi tạo cổng thanh toán Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Đặt hàng bằng phương thức Thanh toán khi nhận hàng (COD)
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Kiểm tra userId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ!" });
        }

        // 📌 Tạo đơn hàng mới
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            status: "Order Placed",
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // ✅ Xóa giỏ hàng của user sau khi đặt hàng thành công
        await cartModel.findOneAndDelete({ userId });

        res.json({ success: true, message: "Đơn hàng đã được đặt thành công!" });
    } catch (error) {
        console.error("🔥 Lỗi khi đặt hàng COD:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
    }
};

// Đặt hàng bằng phương thức thanh toán Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers; // Lấy URL nguồn từ request header

        if (!userId || !items || items.length === 0 || !amount || !address) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu đặt hàng!" });
        }

        // Tạo dữ liệu đơn hàng
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };

        // Lưu đơn hàng vào database
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        
        // Tạo danh sách sản phẩm để thanh toán
        const line_items = []
        
        items.forEach((item) => {
            line_items.push({
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: (item.price) * 100, // Đổi sang cent
                },
                quantity: (item.quantity),
            })
        });

        // Thêm phí vận chuyển vào danh sách thanh toán
        line_items.push({
            price_data: {
                currency: currency,
                product_data: { name: "Phí vận chuyển" },
                unit_amount: Number(deliveryCharge * 100),
            },
            quantity: 1,
        });

        // Tạo phiên thanh toán với Stripe
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Lỗi khi tạo phiên Stripe:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

// Xác minh thanh toán Stripe
const verifyStripe = async (req, res) => {
    try {
        const { orderId, success, userId } = req.body;

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            res.json({ success: true, message: "Thanh toán thành công!" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Thanh toán thất bại, đơn hàng đã bị xóa!" });
        }
    } catch (error) {
        console.error("Lỗi khi xác minh thanh toán:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

// Lấy tất cả đơn hàng cho bảng quản trị
const allOrders = async (req, res) => {
    try {
        
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Lỗi khi lấy tất cả đơn hàng:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

// Lấy danh sách đơn hàng của một người dùng cụ thể
const userOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await orderModel.find({ userId });
        
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Lỗi khi lấy đơn hàng người dùng:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

// Cập nhật trạng thái đơn hàng từ bảng quản trị
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ success: false, message: "ID đơn hàng không hợp lệ" });
        }

        await orderModel.findByIdAndUpdate(orderId, { status });

        res.json({ success: true, message: "Trạng thái đơn hàng đã được cập nhật" });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

// Tính tổng số đơn hàng
const countOrders = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments();
        res.json({ success: true, totalOrders });
    } catch (error) {
        console.error("Lỗi khi đếm đơn hàng:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

// Tính tổng doanh thu
const getTotalRevenue = async (req, res) => {
    try {
        const totalRevenue = await orderModel.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({ success: true, totalRevenue: totalRevenue[0]?.total || 0 });
    } catch (error) {
        console.error("Lỗi khi tính doanh thu:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

export { verifyStripe, placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, countOrders, getTotalRevenue };
