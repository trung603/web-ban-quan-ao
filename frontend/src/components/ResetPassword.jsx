import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { backendUrl } = React.useContext(ShopContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password`, { 
        email, 
        newPassword: password 
      });

      if (response.data.success) {
        toast.success("Mật khẩu đã được cập nhật!");
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <p className="prata-regular text-3xl">Đặt lại mật khẩu</p>
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-full px-3 py-2 border border-gray-800"
        type="password"
        placeholder="Nhập mật khẩu mới"
        required
      />
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        Đặt lại mật khẩu
      </button>
    </form>
  );
};

export default ResetPassword;
