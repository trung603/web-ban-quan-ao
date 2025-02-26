import express from "express";
import { getTotalCustomers } from "../controllers/customerController.js";

const customerRoutes = express.Router();

// Route để lấy tổng số khách hàng
customerRoutes.get("/count", getTotalCustomers);

export default customerRoutes;
