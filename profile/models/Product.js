const mongoose = require("mongoose");

const productItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative."],
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    productsOffered: {
      type: [productItemSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
