import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import favoriteRouter from "./routes/favoriteRoutes.js"; 
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import newsletterRouter from "./routes/newsletterRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import commentrouter from "./routes/commentRoute.js";
import adminRoutes from './routes/adminRoute.js'
import referralRouter from "./routes/referralRoute.js";



//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middleware
app.use(cors());
app.use(express.json());
// Cho phép truy cập ảnh từ thư mục uploads/
app.use("/uploads", express.static("uploads"));

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/favorites", favoriteRouter); 
app.use("/api/cart", cartRouter);
app.use('/api/order', orderRouter)

app.use("/api/newsletter", newsletterRouter); 
app.use("/api/customer", customerRoutes)
// app.use("/api/comments", commentrouter)

app.use("/api/user", adminRoutes);

app.use("/api/refe", referralRouter)

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log("Server started on PORT : " + port));
