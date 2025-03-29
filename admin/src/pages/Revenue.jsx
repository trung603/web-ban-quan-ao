import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";

const Revenue = ({ token, totalRevenue = 0 }) => {
  const [totalImportCost, setTotalImportCost] = useState(0);

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

  // Tính lợi nhuận
  const profit = totalRevenue - totalImportCost;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
      <span className="text-4xl">📊</span>
      <p className="text-lg font-semibold mt-2">Thống kê tài chính</p>

      <div className="mt-2">
        <p className="text-sm text-gray-500">Tổng doanh thu:</p>
        <p className="text-xl font-bold text-blue-600">
          {totalRevenue.toLocaleString()} {currency}
        </p>
      </div>

      <div className="mt-2">
        <p className="text-sm text-gray-500">Tổng giá nhập hàng:</p>
        <p className="text-xl font-bold text-red-600">
          {totalImportCost.toLocaleString()} {currency}
        </p>
      </div>

      <div className="mt-2">
        <p className="text-sm text-gray-500">Lợi nhuận ròng:</p>
        <p>Lợi nhuận trên đơn hàng</p>
        <p className={`text-xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
          {profit.toLocaleString()} {currency}
        </p>
      </div>
    </div>
  );
};

export default Revenue;
