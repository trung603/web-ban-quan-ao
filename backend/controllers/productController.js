import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Hàm thêm sản phẩm
const addProduct = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Lấy các file ảnh từ request
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        // Lọc ra các ảnh không bị undefined
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload ảnh lên Cloudinary và lấy URL
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        // Tạo dữ liệu sản phẩm
        const productData = {
            name,
            description,
            category,
            price: Number(price), // Chuyển đổi giá sang kiểu số
            subCategory,
            bestseller: bestseller === "true", // Chuyển đổi bestseller sang kiểu boolean
            sizes: JSON.parse(sizes), // Chuyển đổi chuỗi JSON thành mảng sizes
            image: imagesUrl, // Lưu danh sách URL ảnh
            date: Date.now(), // Lưu ngày tạo sản phẩm
        };

        console.log("sizes:", sizes);
        console.log(productData);

        // Tạo và lưu sản phẩm vào database
        const product = new productModel(productData);
        await product.save();

        // Trả về phản hồi thành công
        res.json({ success: true, message: "Thêm sản phẩm thành công" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Hàm lấy danh sách sản phẩm
const listProducts = async (req, res) => {
    try {
        // Lấy tất cả sản phẩm từ database
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Hàm xóa sản phẩm
const removeProduct = async (req, res) => {
    try {
        // Xóa sản phẩm theo ID được gửi từ request body
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Xóa thành công sản phẩm" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Hàm lấy thông tin chi tiết của một sản phẩm
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        // Tìm sản phẩm theo ID
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Hàm đếm tổng số sản phẩm
const countProducts = async (req, res) => {
    try {
        const totalProducts = await productModel.countDocuments(); // Đếm số lượng sản phẩm
        res.json({ success: true, total: totalProducts });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


  
export { listProducts, addProduct, removeProduct, singleProduct, countProducts };
