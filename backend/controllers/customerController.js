import User from "../models/userModel.js"; 

// Lấy tổng số khách hàng đã đăng ký
export const getTotalCustomers = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments();
    res.json({ success: true, totalCustomers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy tổng số khách hàng", error: error.message });
  }
};
