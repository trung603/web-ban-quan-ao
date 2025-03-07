import { useState, useEffect } from "react";
import axios from "axios";

const NewsletterList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/newsletter/subguests"); // Đổi URL nếu cần
        setEmails(response.data);
      } catch (err) {
        setError("⚠️ Không thể tải danh sách email.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  if (loading)
    return <p className="text-center text-gray-600">⏳ Đang tải danh sách...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📧 Danh sách email đăng ký</h2>

      {emails.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">📩 Email</th>
                <th className="p-3 text-left">📅 Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((subscriber) => (
                <tr key={subscriber._id} className="border-b hover:bg-gray-100 transition duration-200">
                  <td className="p-3">{subscriber.email}</td>
                  <td className="p-3">{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">📭 Chưa có ai đăng ký.</p>
      )}
    </div>
  );
};

export default NewsletterList;
