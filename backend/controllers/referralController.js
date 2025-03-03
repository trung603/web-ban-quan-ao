import User from "../models/userModel.js";
import Referral from "../models/referralModel.js";

const redeemReferral = async (req, res) => {
    try {
        const { referralCode } = req.body;
        const userId = req.user.id; // ID của người nhập mã

        if (!referralCode) {
            return res.status(400).json({ success: false, message: "Mã giới thiệu không được để trống." });
        }

        // Kiểm tra xem mã có tồn tại trong Referral không
        const referralEntry = await Referral.findOne({ referralCode }).populate("referrerId");
        if (!referralEntry) {
            return res.status(400).json({ success: false, message: "Mã giới thiệu không hợp lệ." });
        }

        // Lấy người giới thiệu
        const referrer = referralEntry.referrerId;
        if (!referrer) {
            return res.status(400).json({ success: false, message: "Không tìm thấy người giới thiệu." });
        }

        // Kiểm tra nếu người dùng đã nhập mã trước đó
        const existingRedemption = await Referral.findOne({
            referredUserId: userId,
        });

        if (existingRedemption) {
            return res.status(400).json({ success: false, message: "Bạn đã nhập mã giới thiệu trước đó." });
        }

        // Không cho phép nhập mã của chính mình
        if (referrer._id.equals(userId)) {
            return res.status(400).json({ success: false, message: "Bạn không thể nhập mã của chính mình." });
        }

        // Cộng điểm cho cả hai người
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
        }

        user.points += 10;
        referrer.points += 20;

        // Lưu dữ liệu
        await user.save();
        await referrer.save();

        // Lưu lịch sử mã giới thiệu đã nhập
        const newReferral = new Referral({
            referrerId: referrer._id,
            referredUserId: userId,
            referralCode,
        });
        await newReferral.save();

        return res.json({ success: true, message: "Mã hợp lệ!", points: user.points });

    } catch (error) {
        console.error("❌ Lỗi redeem referral:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ." });
    }
};

export { redeemReferral };
