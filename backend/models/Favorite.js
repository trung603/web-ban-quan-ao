import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const Favorite = mongoose.model("Favorite", FavoriteSchema);

export default Favorite;
