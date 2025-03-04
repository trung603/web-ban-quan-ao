import mongoose from "mongoose";
import userModel from "./userModel.js";

const referralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, 
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, 
  referralCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const referralModel = mongoose.model("Referral", referralSchema);
export default referralModel;
