import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { backendUrl } = React.useContext(ShopContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });

      if (response.data.success) {
        toast.success("Email hợp lệ! Hãy đặt lại mật khẩu.");
        navigate(`/reset-password?email=${email}`); // Chuyển sang trang đặt lại mật khẩu
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <p className="prata-regular text-3xl">Quên mật khẩu</p>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="w-full px-3 py-2 border border-gray-800"
        type="email"
        placeholder="Nhập email của bạn"
        required
      />
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        Tiếp tục
      </button>
    </form>
  );
};

export default ForgotPassword;
