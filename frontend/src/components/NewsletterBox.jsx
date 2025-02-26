import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const NewsletterBox = () => {
    const [email, setEmail] = useState("");
    const { backendUrl } = React.useContext(ShopContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!email) {
            toast.error("Vui lòng nhập email!");
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/newsletter/subscribe`, { email });

            if (response.data.success) {
                toast.success("Đăng ký thành công!");
                setEmail("");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Lỗi khi đăng ký email:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <div className="text-center">
            <p className="text-2xl font-medium text-gray-800">
                Đăng ký ngay & nhận ưu đãi 20%
            </p>
            <p className="text-gray-400 mt-3">
                Hãy đăng ký để nhận thông tin khuyến mãi và cập nhật mới nhất từ chúng tôi.
                Đừng bỏ lỡ những ưu đãi hấp dẫn dành riêng cho bạn!
            </p>
            <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3">
                <input
                    className="w-full sm:flex-1 outline-none"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="bg-black text-white text-xs px-10 py-4">
                    ĐĂNG KÝ
                </button>
            </form>
        </div>
    );
};

export default NewsletterBox;
