import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

import mongoose from "mongoose";
// Tạo token JWT dựa trên ID người dùng
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Hàm tạo mã giới thiệu duy nhất gồm 6 chữ số
const generateUniqueReferralCode = async () => {
  let code;
  let exists;
  do {
    code = `190${Math.floor(100000 + Math.random() * 900000)}`; // Tạo mã ngẫu nhiên
    exists = await userModel.findOne({ referralCode: code }); // Kiểm tra xem mã đã tồn tại chưa
  } while (exists);
  return code;
};

// Xử lý đăng ký người dùng
const registerUser = async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email đã tồn tại." });
    }

    // Kiểm tra email và mật khẩu hợp lệ
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Email không hợp lệ." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải có ít nhất 8 ký tự." });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      referralCode: await generateUniqueReferralCode(), // Tạo mã giới thiệu mới
    });

    // Kiểm tra mã giới thiệu
    if (referralCode) {
      const referrer = await userModel.findOne({ referralCode });
      if (referrer && referrer._id.toString() !== newUser._id.toString()) {
        // Cộng điểm thưởng cho người giới thiệu
        await userModel.findByIdAndUpdate(referrer._id, { $inc: { points: 10 } });

        // Lưu thông tin giới thiệu vào bảng Referral
        await referralModel.create({
          referrerId: referrer._id,
          referredUserId: newUser._id,
          referralCode,
        });
      }
    }

    // Lưu người dùng mới vào database
    const user = await newUser.save();

    // Tạo token JWT
    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      token,
      userId: user._id,
      referralCode: user.referralCode,
      message: "Đăng ký thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

const User = require("../models/User");

// // Hàm xử lý logic nhập mã giới thiệu
// const redeemReferral = async (req, res) => {
//   try {
//       const { referralCode } = req.body;
//       const userId = req.user.id;

//       if (!referralCode) {
//           return res.status(400).json({ success: false, message: "Mã giới thiệu không được để trống." });
//       }

//       // Tìm user hiện tại
//       const user = await User.findById(userId);
//       if (!user) {
//           return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
//       }

//       console.log("🔹 DEBUG - User hiện tại:", user.email);
//       console.log("🔹 DEBUG - Mã nhập:", referralCode);
//       console.log("🔹 DEBUG - Danh sách usedReferralCodes:", user.usedReferralCodes);

//       // Kiểm tra nếu mã đã được sử dụng trước đó
//       if (user.usedReferralCodes.some(code => code === referralCode)) {
//           console.log("⚠️ Mã đã được sử dụng trước đó:", referralCode);
//           return res.status(400).json({ success: false, message: "Bạn đã nhập mã này trước đó." });
//       }

//       // Tìm user sở hữu mã giới thiệu
//       const referrer = await User.findOne({ referralCode });
//       if (!referrer) {
//           console.log("❌ Mã không hợp lệ:", referralCode);
//           return res.status(400).json({ success: false, message: "Mã giới thiệu không hợp lệ." });
//       }

//       // Không cho phép nhập mã của chính mình
//       if (referrer._id.equals(user._id)) {
//           return res.status(400).json({ success: false, message: "Bạn không thể nhập mã của chính mình." });
//       }

//       // Cộng điểm cho cả hai người
//       user.points += 10;
//       referrer.points += 20;

//       // Lưu mã vào danh sách đã nhập
//       user.usedReferralCodes.push(referralCode);

//       // Lưu lại dữ liệu
//       await user.save();
//       await referrer.save();

//       console.log("✅ Mã hợp lệ! Điểm hiện tại của user:", user.points);
//       return res.json({ success: true, message: "Mã hợp lệ!", points: user.points });

//   } catch (error) {
//       console.error("❌ Lỗi redeem referral:", error);
//       res.status(500).json({ success: false, message: "Lỗi máy chủ." });
//   }
// };

// Lấy thông tin người dùng
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.query; // Lấy userId từ query
    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu userId." });
    }

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

// Đăng nhập người dùng
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Người dùng không tồn tại." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token, userId: user._id });
    } else {
      res.json({ success: false, message: "Sai thông tin đăng nhập." });
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    res.json({ success: false, message: "Lỗi server." });
  }
};

// Đăng nhập Admin
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Sai thông tin đăng nhập." });
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập Admin:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};


// Hàm cập nhật avatar của người dùng
const updateAvatar = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu userId." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Chưa chọn ảnh." });
    }

    const avatarPath = `/uploads/${req.file.filename}`;

    // Chuyển userId sang ObjectId hợp lệ
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Cập nhật avatar vào database
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $set: { avatar: avatarPath } },
      { new: true } // Trả về bản ghi sau khi cập nhật
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
    }
    
    console.log("📌 Kết quả cập nhật:", user);
    res.json({ success: true, avatar: user.avatar });
  } catch (error) {
    console.error("Lỗi khi cập nhật avatar:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

// Lấy danh sách tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password"); // Không trả về mật khẩu
    res.json({ success: true, users });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};


export { loginUser, registerUser, adminLogin, getUserProfile,  updateAvatar, getAllUsers};
