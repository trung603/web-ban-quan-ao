import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusMapping = {
    "Order Placed": "📦 Đơn hàng đã đặt",
    "Packing": "📦 Đang đóng gói",
    "Shipped": "🚚 Đang vận chuyển",
    "Out for delivery": "🚀 Đang giao hàng",
    "Delivered": "✅ Đã giao",
  };

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.get(
        `${backendUrl}/api/order/userorders/${localStorage.getItem('userId') || ''}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            // console.log("🛒 Item từ API:", item);
            allOrdersItem.push({
              ...item,
              image: item.image || [],
              payment:order.payment,
              status: order.status,
              paymentMethod: order.paymentMethod,
              date: order.date,
              quantity: item.quantity, 
            size: item.size,
            });
          });
        });

        // console.log("✅ Danh sách sản phẩm sau xử lý:", allOrdersItem);
        setOrderData(allOrdersItem.reverse());
      } else {
        console.warn("⚠ Không có đơn hàng.");
        setOrderData([]);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
    
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="ĐƠN" text2="HÀNG CỦA TÔI" />
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-6">Đang tải đơn hàng...</p>
      ) : orderData.length > 0 ? (
        orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* Thông tin sản phẩm */}
            <div className="flex items-start gap-6 text-sm">
              <img
                src={item.image[0]}
                alt=''
                className="w-16 sm:w-20"
              />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>
                    {currency}
                    {item.price}
                  </p>
                  <p>Số lượng: {item.quantity}</p>
                  <p>Kích cỡ: {item.size}</p>
                </div>
                <p className="mt-1">
                  Ngày đặt: <span className="text-gray-400">{new Date(item.date).toDateString()}</span>
                </p>
                <p className="mt-1">
                  Thanh toán:{" "}
                  <span className="text-gray-400">{item.paymentMethod}</span>
                </p>
              </div>
            </div>

            {/* Trạng thái đơn hàng & nút theo dõi */}
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm sm:text-[15px]">
                  {statusMapping[item.status] || "Không xác định"}
                </p>
              </div>
              <button
                onClick={loadOrderData}
                className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-200 transition-all"
              >
                THEO DÕI ĐƠN HÀNG
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-6">Không có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default Orders;
