import  jwt  from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Lấy token từ header
  if (!token) return res.status(401).json({ success: false, message: "Không có token!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ!" });
  }
}
export default adminAuth;