import express from "express";
import {
  
  redeemReferral,
  
} from "../controllers/referralController";

const referralRouter = express.Router();

// Thêm route xử lý mã giới thiệu
referralRouter.post("/redeem-referral", redeemReferral);



export default referralRouter;
