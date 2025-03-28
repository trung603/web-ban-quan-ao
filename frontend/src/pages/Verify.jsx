import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from "axios";

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const userId = localStorage.getItem("userId"); 
    console.log("userId nhận được:", userId); 


    const verifyPayment = async () => {
        try {
            if (!token || !userId) return;
    
            const response = await axios.post(
                `${backendUrl}/api/order/verifyStripe`,
                { success, orderId, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.data.success) {
                // 🛒 Xóa giỏ hàng trên backend
                await axios.delete(`${backendUrl}/api/cart/${userId}`);
    
                // Xóa giỏ hàng trên frontend
                setCartItems([]);
                localStorage.setItem("orderCompleted", "true");
                localStorage.removeItem("cartItems"); 
    
                toast.success("Thanh toán thành công!");
                navigate('/orders');
            } else {
                toast.error("Thanh toán thất bại!");
                navigate('/cart');
            }
        } catch (error) {
            console.error("Lỗi xác minh thanh toán:", error);
            toast.error(error.response?.data?.message || "Lỗi xác minh thanh toán");
        }
    };
    

    useEffect(() => {
        verifyPayment();
    }, [token]);

    return (
        <div>
            <h2>Xác minh thanh toán...</h2>
        </div>
    );
};

export default Verify;
