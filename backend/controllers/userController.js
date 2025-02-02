import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import referralModel from "../models/referralModel.js"

// Tạo mã token JWT dựa trên ID người dùng
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Hàm tạo mã giới thiệu duy nhất gồm 6 chữ số
const generateUniqueReferralCode = async (userId) => {
  let code;
  let exists;
  do {
    code = `190${Math.floor(100000 + Math.random() * 900000)}`; // Tạo mã 6 chữ số ngẫu nhiên
    exists = await userModel.findOne({ referralCode: code }); // Kiểm tra mã đã tồn tại chưa
  } while (exists);
  return code;
};


// Xử lý logic đăng nhập người dùng
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    // Kiểm tra mật khẩu có khớp hay không
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id); // Tạo mã token nếu đúng mật khẩu
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Xử lý logic đăng ký người dùng
const registerUser = async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    // Kiểm tra người dùng đã tồn tại
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Kiểm tra định dạng email và mật khẩu
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // Xử lý mã giới thiệu
    if (referralCode) {
      if (!/^\d{6}$/.test(referralCode)) { // Kiểm tra định dạng mã giới thiệu 6 chữ số
        return res.status(400).json({ success: false, message: "Referral code must be 6 digits" });
      }

      const existingReferral = await userModel.findOne({ referralCode });
      if (existingReferral) {
        return res.status(400).json({ success: false, message: "Referral code already taken" });
      }

      // Gán mã giới thiệu do người dùng chọn
      newUser.referralCode = referralCode;
    } else {
      // Nếu không có mã giới thiệu, tự động tạo mã mới
      newUser.referralCode = await generateUniqueReferralCode();
    }

    // Lưu người dùng mới
    const user = await newUser.save();

    // Tạo mã token JWT
    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      token,
      referralCode: user.referralCode,
      message: "Registration successful!",
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Xử lý logic đăng nhập dành cho admin
const adminLogin = async (req, res) => {
  // Logic đăng nhập cho admin
  try {
    const {email, password} = req.body
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      res.json({success:true, token})
    }else{
      res.json({success:false, message:"invalid credentials"})
    }
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { loginUser, registerUser, adminLogin }; 