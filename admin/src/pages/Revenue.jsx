import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";

const Revenue = ({ token, totalRevenue }) => {
  const [totalImportCost, setTotalImportCost] = useState(0);
  useEffect(() => {
    const fetchTotalImportCost = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/order/total-import-cost`);
        if (response.data.success) {
          setTotalImportCost(response.data.totalImportCost);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tổng giá nhập hàng:", error);
      }
    };
  
    if (token) {
      fetchTotalImportCost();
    }
  }, [token]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
  <span className="text-4xl">📉</span>
  <p className="text-lg font-semibold mt-2">Tổng giá nhập</p>
  <p className="text-xl font-bold">{totalImportCost.toLocaleString()} $</p>
</div>
  );
};

export default Revenue;
