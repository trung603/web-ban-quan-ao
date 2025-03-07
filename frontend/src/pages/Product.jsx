import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";

import RelatedProducts from "../components/RelatedProducts";
import Comment from "../components/Comment";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  // State để lưu danh sách bình luận
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
      // Giả sử API trả về danh sách bình luận
      setComments(product.comments || []);
    }
  }, [productId, products]);
  

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/*--------------- product image -----------------*/}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                key={index}
                src={item}
                alt="product"
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[-80%]">
            <img className="w-full h-auto" src={image} alt="selected" />
          </div>
        </div>
        {/* ---------------- product info -------------------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <img key={i} src={assets.star_icon} className="w-3.5" />
            ))}
            <img src={assets.star_dull_icon} className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="my-5 text-gray-500 md:w-4/5">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Chọn kích thước</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`bg-gray-100 border py-2 px-4 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              if (!size) {
                alert("Vui lòng chọn kích thước trước khi thêm vào giỏ hàng!");
                return;
              }
              addToCart(productData._id, size);
            }}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Sản phẩm chính hãng.</p>
            <p>Hỗ trợ thanh toán khi nhận hàng.</p>
            <p>Dễ dàng đổi trả trong vòng 7 ngày.</p>
          </div>
        </div>
      </div>
      
      {/* ---------------description & review section---------------- */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Mô tả</b>
          <p className="border px-5 py-3 text-sm">Đánh giá (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Sản phẩm này vượt quá mong đợi của tôi với chất lượng vượt trội và hiệu suất tuyệt vời. Rất đáng mua!
          </p>
          <p>
            Giá cả hợp lý, sản phẩm có nhiều tính năng tốt và độ bền cao. Tôi rất hài lòng với sản phẩm này.
          </p>
        </div>
      </div>
      <Comment productId={productId} />
      {/* -------------display related products------------- */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
