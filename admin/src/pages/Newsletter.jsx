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
                setError("Không thể tải danh sách email.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchEmails();
    }, []);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Danh sách email đăng ký</h2>
            <ul className="mt-2">
    {emails.length > 0 ? (
        emails.map((subscriber) => (
            <li key={subscriber._id} className="p-2 border-b">
                {subscriber.email} - <span className="text-gray-500">{new Date(subscriber.createdAt).toLocaleDateString()}</span>
            </li>
        ))
    ) : (
        <p>Chưa có ai đăng ký.</p>
    )}
</ul>
        </div>
    );
};

export default NewsletterList;
