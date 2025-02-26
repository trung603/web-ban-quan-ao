import React, { useState } from 'react';
import { assets } from '../assets/admin_assets/assets';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  // State lưu trữ dữ liệu sản phẩm
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // Hàm xử lý khi gửi biểu mẫu
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } });
      console.log(response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      {/* Tải ảnh lên */}
      <div>
        <p className='mb-2'>Tải ảnh lên</p>
        <div className='flex gap-2'>
          {[1, 2, 3, 4].map((num) => (
            <label key={num} htmlFor={`image${num}`}>
              <img className='w-20' src={!eval(`image${num}`) ? assets.upload_area : URL.createObjectURL(eval(`image${num}`))} alt="" />
              <input onChange={(e) => eval(`setImage${num}`)(e.target.files[0])} type="file" id={`image${num}`} hidden />
            </label>
          ))}
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div>
        <p className='w-full'>Tên sản phẩm</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nhập tên sản phẩm' required />
      </div>
      <div>
        <p className='w-full'>Mô tả sản phẩm</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Nhập mô tả sản phẩm' required />
      </div>

      {/* Danh mục, loại sản phẩm, giá */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Danh mục sản phẩm</p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Men">Nam</option>
            <option value="Women">Nữ</option>
            <option value="couple">Đồ đôi</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Loại sản phẩm</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Topwear">Áo</option>
            <option value="Bottomwear">Quần</option>
            <option value="Winterwear">Đồ mùa đông</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Giá sản phẩm</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='Nhập giá' />
        </div>
      </div>

      {/* Chọn kích cỡ */}
      <div>
        <p className='mb-2'>Kích cỡ sản phẩm</p>
        <div className='flex gap-3'>
          {["S", "M", "L", "XL", "2XL"].map((size) => (
            <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}>
              <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>{size}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer' htmlFor="bestseller">Thêm vào danh sách bán chạy</label>
      </div>

      {/* Nút gửi */}
      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>THÊM</button>
    </form>
  );
};

export default Add;
