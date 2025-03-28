import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import { IoGiftOutline } from "react-icons/io5";

const Profile = () => {
  const { token, setToken, setCartItems } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchUserProfile = async () => {
      try {
        
        const userId = localStorage.getItem("userId"); // Lưu userId sau khi đăng nhập
        if (!userId) {
          navigate("/login");
          return;
        }
    
        const response = await axios.get(`http://localhost:4000/api/user/profile?userId=${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    
    fetchUserProfile();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  const handleReferralCodeSubmit = async () => {
    if (!referralCode) {
      setMessage("Vui lòng nhập mã giới thiệu!");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:4000/api/refe/redeem-referral",
        { referralCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        setMessage(`✅ Mã hợp lệ! Bạn nhận ${response.data.points} điểm.`);
        
        // Cập nhật lại thông tin user
        const profileRes = await axios.get("http://localhost:4000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileRes.data.user);
      }
    } catch (error) {
      console.error("❌ Lỗi gửi mã giới thiệu:", error.response?.data || error);
  
      // Hiển thị thông báo lỗi
      setMessage(error.response?.data?.message || "Có lỗi xảy ra.");
  
      // Nếu lỗi do đã dùng mã, ẩn ô nhập mã
      if (error.response?.data?.message === "Bạn đã sử dụng mã giới thiệu trước đó.") {
        setReferralCode(""); // Xóa input để tránh nhập lại
      }
    }
  };
  
// upload ảnh đại diện
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);
  formData.append("userId", user._id); // Gửi ID người dùng

  try {
    const response = await axios.post(
      "http://localhost:4000/api/user/update-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      console.log("✅ Avatar cập nhật thành công:", response.data.avatar);
    }
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật avatar:", error);
  }
};


  if (!user) return <p className="text-center mt-10">Đang tải...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
      <div className="flex flex-col items-center">
  <label htmlFor="avatarUpload" className="cursor-pointer">
    <img
      src={`http://localhost:4000${user.avatar}`} // Hiển thị avatar từ backend
      alt="Avatar"
      className="w-28 h-28 rounded-full border-4 border-blue-400 object-cover shadow-md"
    />
    <p className="text-center">{user.name}</p>
  </label>
  <input
    type="file"
    id="avatarUpload"
    accept="image/*"
    onChange={handleAvatarUpload}
    className="hidden"
  />
</div>

      <div className="mt-6 space-y-4 text-gray-700">
      <p><strong>📧 Email:</strong> {user.email}</p>
        <p><strong>📍 Địa chỉ ID:</strong> {user._id || "Chưa cập nhật"}</p>
        <p><strong>🎟️ Mã giới thiệu:</strong> {user.referralCode || "Chưa cập nhật"}</p>
        <p className="flex items-center gap-2 text-lg font-semibold text-blue-600">
          <IoGiftOutline /> Điểm thưởng: {user.points || 0} điểm
        </p>
      </div>

      <div className="mt-6">
        <input
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập mã giới thiệu"
        />
        <button
          onClick={handleReferralCodeSubmit}
          className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          Áp dụng mã giới thiệu
        </button>
      </div>

      {message && <p className="mt-3 text-center text-red-500">{message}</p>}

      <button
        onClick={handleLogout}
        className="mt-5 w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
      >
        <FaSignOutAlt className="mr-2" /> Đăng xuất
      </button>
    </div>
  );
};

export default Profile;
