import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevent");

  // Hàm toggle chọn category loại danh mục
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Hàm toggle chọn subCategory loại sản phẩm
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Hàm lọc sản phẩm dựa trên tìm kiếm, danh mục và loại sản phẩm
  const applyFilter = () => {
    let productsCopy = products.slice();
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    setFilterProducts(productsCopy);
  };

  // Hàm sắp xếp sản phẩm theo giá
  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  // Cập nhật danh sách sản phẩm khi có thay đổi trong bộ lọc
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  // Cập nhật danh sách sản phẩm khi có thay đổi trong sắp xếp
  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          BỘ LỌC
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">DANH MỤC</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"Men"}
                type="checkbox"
                onChange={toggleCategory}
              />
              Nam
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"Women"}
                type="checkbox"
                onChange={toggleCategory}
              />
              Nữ
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"couple"}
                type="checkbox"
                onChange={toggleCategory}
              />
              Đồ đôi
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"kid"}
                type="checkbox"
                onChange={toggleCategory}
              />
              Trẻ con
            </p>
          </div>
        </div>
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">LOẠI</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"Topwear"}
                type="checkbox"
                onChange={toggleSubCategory}
              />
              Áo
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"Bottomwear"}
                type="checkbox"
                onChange={toggleSubCategory}
              />
              Quần dài
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"short"}
                type="checkbox"
                onChange={toggleSubCategory}
              />
              Quần ngắn
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"Winterwear"}
                type="checkbox"
                onChange={toggleSubCategory}
              />
              Áo khoác nam
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"Winterwear"}
                type="checkbox"
                onChange={toggleSubCategory}
              />
              Áo khoác nữ
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"sweater"}
                type="checkbox"
                onChange={toggleSubCategory}
              />
              Áo Sweater
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"dress"}
                type="checkbox"
                onChange={toggleSubCategory}
              />
              Váy
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                value={"overalls"}
                type="checkbox"
                onChange={toggleSubCategory}
              />
              Váy yếm
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"BỘ"} text2={"SƯU TẬP"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sắp xếp: Liên quan</option>
            <option value="low-high">Sắp xếp: Giá thấp đến cao</option>
            <option value="high-low">Sắp xếp: Giá cao đến thấp</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
              stock={item.stock}       
              isOutOfStock={item.stock === 0}
              discount={item.discount}
              showStock={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
