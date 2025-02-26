import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { backendUrl } from '../../../admin/src/App'
import { toast } from 'react-toastify'
import axios from "axios";

const Verify = () => {
    const {navigate, token, setCartItems} = useContext(ShopContext)
    const [searchParams] = useSearchParams()

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')  // Sửa lỗi lấy nhầm giá trị
    const userId = searchParams.get('userId')    // Thêm userId nếu backend cần

    const verifyPayment = async () => {
    try {
        if (!token) {
            toast.error("Lỗi: Token không hợp lệ, vui lòng đăng nhập lại!");
            navigate('/login'); // Chuyển hướng người dùng đến trang đăng nhập
            return;
        }
        if (!orderId || !success) {
            toast.error("Lỗi: Thông tin xác nhận thanh toán bị thiếu!");
            return;
        }

        const response = await axios.post(
            `${backendUrl}/api/order/verifyStripe`, 
            { success, orderId, userId },  
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
            setCartItems({});
            navigate('/orders');
        } else {
            toast.error(response.data.message || "Xác minh thất bại");
            navigate('/cart');
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Lỗi xác minh thanh toán");
    }
};
    useEffect(()=>{
        verifyPayment();
    }, [token]);

    return (
        <div>
            <h2>Xác minh thanh toán...</h2>
        </div>
    )
}

export default Verify
