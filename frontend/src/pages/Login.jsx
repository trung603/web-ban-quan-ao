import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Đăng nhập');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Đăng ký') {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          const { token, userId, referralCode, name } = response.data;
          setToken(token);

          // Lưu thông tin vào localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('userEmail', email);
          localStorage.setItem('referralCode', referralCode);
          localStorage.setItem("user", name);

          toast.success('Đăng ký thành công! 🎉');
          navigate('/'); // Điều hướng về trang chính
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          const { token, userId, name } = response.data; // Lấy thêm name từ API
          setToken(token);

          // Lưu thông tin vào localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('userEmail', email);
          localStorage.setItem("user", name); // ➜ Lưu tên vào localStorage
          
          console.log("Dữ liệu user từ localStorage:", localStorage.getItem("user"));
          toast.success('Đăng nhập thành công! 🚀');
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
        console.log("info",response.data);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Đã xảy ra lỗi! Vui lòng thử lại.');
    }
};


  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]); // Thêm navigate vào dependencies để tránh lỗi

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === 'Đăng nhập' ? (
        ''
      ) : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full px-3 py-2 border border-gray-800"
          type="text"
          placeholder="Họ và tên"
          required
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="w-full px-3 py-2 border border-gray-800"
        type="email"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-full px-3 py-2 border border-gray-800"
        type="password"
        placeholder="Mật khẩu"
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p onClick={() => navigate('/forgotpassword')} className="cursor-pointer">Quên mật khẩu?</p>
        {currentState === 'Đăng nhập' ? (
          <p onClick={() => setCurrentState('Đăng ký')} className="cursor-pointer">
            Tạo tài khoản mới
          </p>
        ) : (
          <p onClick={() => setCurrentState('Đăng nhập')} className="cursor-pointer">
            Đăng nhập tại đây
          </p>
        )}
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === 'Đăng nhập' ? 'Đăng nhập' : 'Đăng ký'}
      </button>
    </form>
  );
};

export default Login;
