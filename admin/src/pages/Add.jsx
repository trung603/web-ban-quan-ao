import React, { useState } from 'react';
import { assets } from '../assets/admin_assets/assets';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [importPrice, setImportPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [status, setStatus] = useState("Còn hàng");
  const [type, setType] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("importPrice", importPrice);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("stock", stock);
      formData.append("discount", discount);
      formData.append("status", status);
      

      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers:{ Authorization: `Bearer ${token}`  }});

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setPrice('');
        setImportPrice('');
        setStock('');
        setDiscount('');
        setStatus('Còn hàng');
        setType('');
        setImages([null, null, null, null]);
        setBestseller(false);
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
      <div>
        <p className='mb-2'>Tải ảnh lên</p>
        <div className='flex gap-2'>
          {images.map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img className='w-20' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
              <input onChange={(e) => {
                const newImages = [...images];
                newImages[index] = e.target.files[0];
                setImages(newImages);
              }} type="file" id={`image${index + 1}`} hidden />
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className='w-full'>Tên sản phẩm</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nhập tên sản phẩm' required />
      </div>
      <div>
        <p className='w-full'>Mô tả sản phẩm</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Nhập mô tả sản phẩm' required />
      </div>
      <div>
        <p className='mb-2'>Danh mục sản phẩm</p>
        <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
          <option value="Men">Nam</option>
          <option value="Women">Nữ</option>
          <option value="couple">Đồ đôi</option>
          <option value="kid">Trẻ con</option>
        </select>
      </div>
      <div>
        <p className='mb-2'>Loại sản phẩm</p>
        <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2'>
          <option value="Topwear">Áo</option>
          <option value="Bottomwear">Quần dài</option>
          <option value="short">Quần ngắn</option>
          <option value="Winterwear">Áo khoác nam</option>
          <option value="womenjacket">Áo khoác nữ</option>
          <option value="sweater">Áo sweater</option>
          <option value="dress">Váy</option>
          <option value="overalls">Váy yếm</option>
        </select>
      </div>
      <div>
        <p className='mb-2'>Giá sản phẩm</p>
        <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2' type="Number" placeholder='Nhập giá sản phẩm' required />
      </div>
      <div>
        <p className='mb-2'>Sản phẩm bán chạy</p>
        <input type="checkbox" checked={bestseller} onChange={() => setBestseller(!bestseller)} />
        <label className='ml-2'>Thêm vào danh sách bán chạy</label>
      </div>
      <div>
        <p className='mb-2'>Trạng thái sản phẩm</p>
        <select onChange={(e) => setStatus(e.target.value)} value={status} className='w-full px-3 py-2'>
          <option value="Còn hàng">Còn hàng</option>
          <option value="Hết hàng">Hết hàng</option>
        </select>
      </div>
      <div>
        <p className='mb-2'>Giảm giá (%)</p>
        <input onChange={(e) => setDiscount(e.target.value)} value={discount} className='w-full px-3 py-2' type="Number" placeholder='Nhập % giảm giá' />
      </div>
      <div>
        <p className='mb-2'>Số lượng trong kho</p>
        <input onChange={(e) => setStock(e.target.value)} value={stock} className='w-full px-3 py-2' type="Number" placeholder='Nhập số lượng' required />
      </div>
      <div>
        <p className='mb-2'>Giá nhập</p>
        <input 
          onChange={(e) => setImportPrice(e.target.value)} 
          value={importPrice} 
          className='w-full px-3 py-2' 
          type="Number" 
          placeholder='Nhập giá nhập' 
          required 
        />
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

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>THÊM</button>
    </form>
  );
};

export default Add;