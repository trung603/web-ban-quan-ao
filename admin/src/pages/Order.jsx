import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  

  // Lấy danh sách đơn hàng
  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi lấy đơn hàng.");
    }
  };

  // Cập nhật trạng thái đơn hàng
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        await fetchAllOrders();
      }
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái đơn hàng.");
    }
  };

 

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

 

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h3 className="text-3xl font-bold mb-6 text-gray-800">🛒 Đơn Hàng Của Bạn</h3>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-300 p-6 md:p-8 hover:shadow-2xl transition-all">
              <div className="p-6 bg-white rounded-lg shadow-lg grid grid-cols-4 gap-2 items-start">
                {/* Thông tin sản phẩm */}
                <div className="flex items-start gap-4">
                  <img src={assets.parcel_icon} alt="Gói hàng" className="w-14 h-14" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {order.items[0]?.name} × {order.items[0]?.quantity}
                    </p>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><span className="font-semibold">Người nhận:</span> {order.address.firstName} {order.address.lastName}</p>
                      <p><span className="font-semibold">Địa chỉ:</span> {order.address.street}, {order.address.city}</p>
                      <p><span className="font-semibold">Số điện thoại:</span> {order.address.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Thông tin giao hàng */}
                <div className="w-1/2 mx-auto text-sm text-gray-700 space-y-1">
                  <p>Đơn hàng: {order.items.length}</p>
                  <p>Phương thức thanh toán: {order.paymentMethod}</p>
                  <p>Trạng thái thanh toán: {order.payment ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                  <p className="flex gap-2 items-center">Ngày đặt hàng: {new Date(order.date).toLocaleDateString()}</p>
                </div>

                {/* Tổng giá trị đơn hàng */}
                <div className="flex flex-col justify-center items-center text-sm sm:text-[15px]">
                  <p><strong>Tổng tiền:</strong> {currency}{order.amount}</p>
                </div>

                {/* Trạng thái đơn hàng */}
                <div className="flex flex-col items-center">
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="p-2 mt-2 border border-gray-400 rounded-lg px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <option value="Order Placed">📦 Đơn hàng đã đặt</option>
                    <option value="Packing">📦 Đang đóng gói</option>
                    <option value="Shipped">🚚 Đang vận chuyển</option>
                    <option value="Out for delivery">🚀 Đang giao hàng</option>
                    <option value="Delivered">✅ Đã giao</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-lg">Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default Order;
