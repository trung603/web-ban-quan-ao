import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductItem = ({ id, image, name, price, stock, discount, isFavorite, showStock = false}) => {
  const { currency } = useContext(ShopContext);
  const [favorite, setFavorite] = useState(isFavorite);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userId = localStorage.getItem("userId");

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Ngăn chặn việc chuyển trang khi nhấn vào biểu tượng

    if (!userId) {
      console.error('Thiếu userId, không thể thực hiện thao tác yêu thích.');
      return;
    }
    console.log('usserID', userId);
    try {
      if (favorite) {
        await axios.delete(`${backendUrl}/api/favorites/${userId}/${id}`);
      } else {
        await axios.post(`${backendUrl}/api/favorites`, { productId: id, userId });
      }
      toast.success("Thêm vào danh sách yêu thích thành công");
      setFavorite(!favorite);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái yêu thích:', error);
    }
  };

  return (
    <Link className='text-gray-700 cursor-pointer relative' to={`/product/${id}`}>
      <div className='overflow-hidden relative'>
        <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt={name} />

        {/* Hiển thị trạng thái "Hết hàng" */}
        {stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Hết hàng
          </div>
        )}

        {/* Hiển thị giảm giá */}
        {discount > 0 && (
          <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            -{discount}%
          </div>
        )}

        {/* Nút yêu thích */}
        <div
          onClick={toggleFavorite}
          className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-100 hover:scale-110 transition"
        >
          {favorite ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-400 text-lg" />
          )}
        </div>
      </div>

      <p className='pt-3 pb-1 text-sm'>{name}</p>

      {/* Hiển thị giá sau khi giảm */}
      <p className='text-sm font-medium'>
        {discount > 0 ? (
          <>
            <span className="text-red-500">
              {currency}{(price * (1 - discount / 100)).toFixed(0)}
            </span>
            <span className="text-gray-500 line-through ml-2">{currency}{price}</span>
          </>
        ) : (
          <span>{currency}{price}</span>
        )}
      </p>

      {/* Hiển thị số lượng sản phẩm */}
      {showStock && <p className='text-gray-500 text-sm'>Số lượng: {stock}</p>}
    </Link>
  );
};

export default ProductItem;
