import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: String,
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  description: String,
  imageUrls: {
    type: [String], //multiple urls pathauna ko lagi array use gareko 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const model = mongoose.model("Product", productSchema);

export default model;

// hamile product.js product ko model banako ho yesari ni category ra aruko ni model banayera kaam garn sakinxa 
