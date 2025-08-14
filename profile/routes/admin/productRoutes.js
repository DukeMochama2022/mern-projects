const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../../controllers/productController");
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");
const productRouter = express.Router();

productRouter.post("/create-product", authMiddleware, isAdmin, createProduct);
productRouter.get("/get-all-products", getProducts);
productRouter.get("/get-product/:id", getProductById);
productRouter.put(
  "/update-product/:id",
  authMiddleware,
  isAdmin,
  updateProduct
);
productRouter.delete(
  "/delete-product/:id",
  authMiddleware,
  isAdmin,
  deleteProduct
);

module.exports = { productRouter };
