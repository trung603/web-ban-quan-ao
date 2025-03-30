import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";

const Revenue = ({ token, totalRevenue = 0 }) => {
  const [totalImportCost, setTotalImportCost] = useState(0);
  const [orders, setOrders] = useState([]);
  const [importCosts, setImportCosts] = useState({});

  // Lấy danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/order/list`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Lấy tổng giá nhập hàng
  useEffect(() => {
    const fetchTotalImportCost = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/order/total-import-cost`);
        if (response.data.success) {
          setTotalImportCost(response.data.totalImportCost || 0);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tổng giá nhập hàng:", error);
      }
    };

    if (token) {
      fetchTotalImportCost();
    }
  }, [token]);

  // Lấy giá nhập hàng của từng đơn hàng
  useEffect(() => {
    const fetchImportCosts = async () => {
      const newImportCosts = {};

      await Promise.all(
        orders.map(async (order) => {
          try {
            const response = await axios.get(`${backendUrl}/api/order/import-cost/${order._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
              newImportCosts[order._id] = response.data.totalImportCost;
            }
          } catch (error) {
            console.error(`Lỗi khi lấy giá nhập hàng của đơn ${order._id}:`, error);
          }
        })
      );

      setImportCosts(newImportCosts);
    };

    if (orders.length > 0) {
      fetchImportCosts();
    }
  }, [orders, token]);

  // Tính lợi nhuận dòng
  const profit = totalRevenue - totalImportCost;
  // Tính tổng giá nhập của tất cả đơn hàng
  const totalImportCostFromOrders = Object.values(importCosts).reduce((sum, cost) => sum + (cost || 0), 0);
  // Tính lợi nhuận 
  const newProfit = totalRevenue - totalImportCostFromOrders;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-2xl font-bold mb-4">📊 Thống kê tài chính</h3>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Tổng doanh thu:</p>
          <p className="text-xl font-bold text-blue-600">{totalRevenue.toLocaleString()} {currency}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Tổng giá nhập hàng:</p>
          <p className="text-xl font-bold text-red-600">{totalImportCost.toLocaleString()} {currency}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Lợi nhuận ròng:</p>
          <p className={`text-xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {profit.toLocaleString()} {currency}
          </p>
        </div>
      </div>

      {/* Danh sách đơn hàng và tổng giá nhập */}
<div className="mt-6">
  <h4 className="text-lg font-bold">📦 Tổng lợi nhuận từ đơn hàng</h4>

  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between">
    <span className="text-gray-600">Tổng giá nhập của các đơn hàng:</span>
    <span className="text-xl font-bold text-red-600">
      {totalImportCostFromOrders.toLocaleString()} {currency}
    </span>
  </div>

  {/* Hiển thị lợi nhuận */}
  <div className="bg-gray-50 p-4 mt-4 rounded-lg shadow-sm flex justify-between">
    <span className="text-gray-600">💰 Lợi nhuận :</span>
    <span className={`text-xl font-bold ${newProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
      {newProfit.toLocaleString()} {currency}
    </span>
  </div>
</div>

    </div>
  );
};

export default Revenue;
