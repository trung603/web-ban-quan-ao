
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email!" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "Email không tồn tại trong hệ thống!" });
    }

    return res.json({ success: true, message: "Email hợp lệ, hãy đặt lại mật khẩu!" });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// api đặt lại mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: "Thiếu email hoặc mật khẩu mới!" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "Email không tồn tại!" });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu trong database
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Mật khẩu đã được cập nhật!" });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};
  
export { forgotPassword, resetPassword };
