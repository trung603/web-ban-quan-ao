import express from "express";
import { redeemReferral } from "../controllers/referralController.js";
import referralToken from "../middleware/referralAuth.js";


const referralRouter = express.Router();


// Thêm route xử lý mã giới thiệu
referralRouter.post("/redeem-referral",referralToken, redeemReferral);


export default referralRouter;
