import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Not Authorized, Please Login Again" });
    }

    const token = authHeader.split(" ")[1]; // Lấy phần token sau "Bearer "

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId }; // Gán userId vào req.user
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

export default authUser;
