import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosClient from '../apis/axiosClient'

export const ShopContext = createContext(); // Tạo context Shopcontext

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Lấy giỏ hàng từ localStorage khi khởi động nếu không có DL thì rỗng
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  // Lấy dữ liệu giỏ hàng từ backend
const getProductInCart = async()=> {
  if(!token) return 
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.warn("Không tìm thấy userId trong localStorage");
    return;
  }

  await axiosClient.get(`/api/cart/${userId}`)
  .then((res)=> {
    setCartItems(res.data.cartData || []);
    localStorage.setItem("cartItems", JSON.stringify(res.data.cartData || []));
  })
  .catch((error)=> {
    console.error('Get Cart data error >>>>', error?.message);
    setCartItems([]);
  })
}
  
  // 🛍️ Thêm sản phẩm vào giỏ hàng
  const addToCart = async (itemId, size, stock) => {
    if (stock === 0) {
      toast.error("Sản phẩm đã hết hàng và không thể thêm vào giỏ hàng!");
      return;
    }
  
    if (!size) {
      toast.warn("Vui lòng chọn kích thước trước khi thêm vào giỏ hàng!");
      return;
    }
  
    setCartItems((prev) => {
      let newCart = { ...prev };
      if (!newCart[itemId]) newCart[itemId] = {};
      newCart[itemId][size] = {
        quantity: (newCart[itemId][size]?.quantity || 0) + 1,
      };
      localStorage.setItem("cartItems", JSON.stringify(newCart));
      return newCart;
    });
  
    if (token) {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("Lỗi: Không tìm thấy userId!");
          return;
        }
  
        const cartItem = { userId, itemId, size, quantity: 1 };
        const response = await axios.post(`${backendUrl}/api/cart/add`, cartItem, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data.success) {
          toast.success("Thêm vào giỏ hàng thành công!");
        } else {
          toast.error("Lỗi khi thêm vào giỏ hàng!");
        }
      } catch (error) {
        toast.error("Lỗi khi thêm vào giỏ hàng!");
      }
    }
  };
  
  
  // 📌 Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = async (itemId, size, quantity) => {
    if (quantity < 0) {
      toast.error("Số lượng không hợp lệ!");
      return;
    }

    if (token) {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("Lỗi: Không tìm thấy userId!");
          return;
        }

        const cartItem = { userId, itemId, size, quantity };
        await axios.post(`${backendUrl}/api/cart/update`, cartItem, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (quantity === 0) {
          const removeData = cartItems?.filter(ite => ite?._id !== itemId)
          setCartItems([...removeData])
        } else {
          const indexItem = cartItems.findIndex(val => val?._id === itemId)
          cartItems?.splice(indexItem, 1, 
            {
              ...cartItems?.[indexItem],
              size: quantity
            })
          setCartItems(cartItems => [...cartItems])
        }
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        toast.success("Cập nhật giỏ hàng thành công!");
      } catch (error) {
        toast.error("Lỗi khi cập nhật giỏ hàng!");
      }
    }
  };

  // 🛒 Tính tổng số lượng sản phẩm trong giỏ hàng
  const getCartCount = () => {
    return cartItems?.length || 0
  };
  
  // 💰 Tính tổng giá trị giỏ hàng
  const getCartAmount = () => {
    if (!Array.isArray(cartItems)) {
      console.warn("cartItems không phải là một mảng:", cartItems);
      return 0; // Trả về 0 nếu dữ liệu không hợp lệ
    }
  
    let totalAmount = cartItems.reduce((total, item) => {
      if (item?.price && item?.quantity) {
        return total + item.price * item.quantity;
      } else {
        console.warn("Lỗi dữ liệu sản phẩm trong giỏ hàng:", item);
        return total; // Bỏ qua sản phẩm có lỗi
      }
    }, 0);
  
    return totalAmount;
  };
  
  // 📦 Lấy danh sách sản phẩm từ API
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi lấy sản phẩm!");
    }
  };

  // 🚀 Load sản phẩm khi khởi chạy
  useEffect(() => {
    getProductsData();
  }, []);

  // 🔄 Lấy lại giỏ hàng khi có token mới
  useEffect(() => {
    if (token) {
      getProductInCart()
    }
  }, [token]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setCartItems({});
    localStorage.removeItem("cartItems");
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    logout,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;