import express from "express";
import { getAllUsers, deleteUser, updateUser } from "../controllers/adminUserController.js";

const adminRoutes = express.Router();

adminRoutes.get("/userlist", getAllUsers);// Lấy danh sách người dùng
adminRoutes.delete("/users/:userId", deleteUser); // Xóa người dùng
adminRoutes.put("/users/:userId", updateUser); // Cập nhật thông tin người dùng

export default router;
