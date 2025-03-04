import userModel from "../models/userModel.js";
import referralModel from "../models/referralModel.js";

const redeemReferral = async (req, res) => {
    try {
        console.log("🔹 Dữ liệu nhận từ frontend:", req.body);

        // Kiểm tra req.user
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Người dùng chưa đăng nhập." });
        }

        const { referralCode } = req.body;
        const userId = req.user?._id; // ID của người nhập mã

        if (!referralCode) {
            return res.status(400).json({ success: false, message: "Mã giới thiệu không được để trống." });
        }

        // Tìm người giới thiệu bằng referralCode
        const referrer = await userModel.findOne({ referralCode });

        if (!referrer) {
            return res.status(400).json({ success: false, message: "Mã giới thiệu không hợp lệ." });
        }

        // Không cho phép nhập mã của chính mình
        if (referrer._id.equals(userId)) {
            return res.status(400).json({ success: false, message: "Bạn không thể nhập mã của chính mình." });
        }

        // Kiểm tra nếu user đã nhập mã trước đó
        const existingRedemption = await referralModel.findOne({ referredUserId: userId });
        if (existingRedemption) {
            console.log("⚠️ Người dùng đã nhập mã trước đó:", referralCode);
            return res.status(400).json({ success: false, message: "Bạn đã nhập mã giới thiệu trước đó." });
        }

        // Cộng điểm cho cả hai
        await userModel.findByIdAndUpdate(userId, { $inc: { points: 5 } }); // 🎯 Người nhập mã +5 điểm
        await userModel.findByIdAndUpdate(referrer._id, { $inc: { points: 10 } }); // 🎯 Người giới thiệu +10 điểm

        // Lưu lịch sử referral
        const newReferral = new referralModel({
            referrerId: referrer._id,
            referredUserId: userId,
            referralCode,
        });
        await newReferral.save();

        console.log("✅ Mã giới thiệu đã được áp dụng thành công!");
        return res.status(200).json({ success: true, message: "Nhập mã thành công! Điểm đã được cộng." });

    } catch (error) {
        console.error("❌ Lỗi redeem referral:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ." });
    }
};

export { redeemReferral };
