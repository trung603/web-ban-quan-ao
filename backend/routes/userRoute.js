import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getUserProfile,

  updateAvatar,
} from "../controllers/userController.js";
import upload from "../middleware/uploads.js";
import { forgotPassword, resetPassword} from "../controllers/authController.js";
import referralToken from "../middleware/referralAuth.js";


const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

userRouter.get("/profile", getUserProfile);
// // Thêm route xử lý mã giới thiệu
// userRouter.post("/redeem-referral",referralToken, redeemReferral);
// Route upload ảnh
userRouter.post("/update-avatar", upload.single("avatar"), updateAvatar);

//route quên mật khẩu
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
