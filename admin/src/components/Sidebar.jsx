import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/admin_assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';

const Sidebar = ({ token }) => {
  const [admin, setAdmin] = useState({ name: "Admin", avatar: "" });
  const navigate = useNavigate(); 

  return (
    <div className="w-[18%] min-h-screen border-r-2 flex flex-col">
      <div 
        className="flex flex-col items-center gap-2 py-6 border-b cursor-pointer hover:bg-gray-100"
        onClick={() => navigate("/admin/dashboard")}
      >
        <img
          src={admin.avatar || "https://www.shutterstock.com/image-vector/man-inscription-admin-icon-outline-600nw-1730974153.jpg"}
          alt="Admin Avatar"
          className="w-14 h-14 rounded-full border border-gray-300"
        />
        <p className="font-semibold text-gray-700">{admin.name}</p>
        <p>Chào mừng bạn đã quay trở lại !</p>
      </div>

      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/add">
          <img className="w-5 h-5" src={assets.add_icon} alt="" />
          <p className="hidden md:block">Thêm sản phẩm</p>
        </NavLink>
        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/list">
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">Danh sách sản phẩm</p>
        </NavLink>
        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/order">
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">Danh sách đơn hàng</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
