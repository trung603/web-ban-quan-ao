import mongoose from "mongoose";
import  userModel from "./userModel.js"; 

const referralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Người giới thiệu
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Người được giới thiệu
  referralCode: { type: String, required: true }, // Mã giới thiệu
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo
});

const referralModel = mongoose.model("Referral", referralSchema);
export default referralModel;