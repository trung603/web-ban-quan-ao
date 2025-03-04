import Newsletter from "../models/newletterModel.js";

const subscribeNewsletter = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Vui lòng nhập email!" });
    }

    try {
        // Kiểm tra email đã tồn tại chưa
        const existingEmail = await Newsletter.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email này đã được đăng ký trước đó!" });
        }

        // Lưu email mới vào database
        const newSubscription = new Newsletter({ email });
        await newSubscription.save();

        return res.status(201).json({ success: true, message: "Đăng ký thành công!" });
    } catch (error) {
        console.error("Lỗi khi đăng ký email:", error);
        return res.status(500).json({ success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau!" });
    }
};
// lấy thông tin khách
const getNewsletterSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find({}, "email createdAt"); // Chỉ lấy email và ngày tạo
        return res.status(200).json(subscribers);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách email:", error);
        return res.status(500).json({ success: false, message: "Không thể lấy danh sách email!" });
    }
};
export {subscribeNewsletter, getNewsletterSubscribers};