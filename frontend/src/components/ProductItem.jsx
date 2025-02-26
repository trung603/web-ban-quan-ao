import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';

const ProductItem = ({ id, image, name, price, isFavorite }) => {
  const { currency } = useContext(ShopContext);
  const [favorite, setFavorite] = useState(isFavorite);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Ngăn chặn việc chuyển trang khi nhấn vào biểu tượng

    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Sử dụng biến môi trường

    if (favorite) {
      // Xóa khỏi danh sách yêu thích
      try {
        await axios.delete(`${backendUrl}/api/favorites/${id}`);
        setFavorite(false);
      } catch (error) {
        console.error('Lỗi khi xóa khỏi yêu thích:', error);
      }
    } else {
      // Thêm vào danh sách yêu thích
      try {
        await axios.post(`${backendUrl}/api/favorites`, { productId: id });
        setFavorite(true);
      } catch (error) {
        console.error('Lỗi khi thêm vào yêu thích:', error);
      }
    }
  };

  return (
    <Link className='text-gray-700 cursor-pointer relative' to={`/product/${id}`}>
      <div className='overflow-hidden relative'>
        <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt={name} />
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
      <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  );
};

export default ProductItem;
