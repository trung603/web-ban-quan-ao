import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

export default Newsletter;

