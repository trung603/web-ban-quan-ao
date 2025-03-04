import jwt from "jsonwebtoken";

 const referralToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header

    if (!token) {
        return res.status(401).json({ success: false, message: "Không có quyền truy cập" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Gán user vào request
        console.log("🆔 User từ token:", req.user);
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: "Token không hợp lệ" });
    }
};
export default referralToken;
