const express = require("express");
const categoryRouter = express.Router();
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../../controllers/categoryController");

categoryRouter.post(
  "/create-category",
  authMiddleware,
  isAdmin,
  createCategory
);
categoryRouter.get("/get-categories", authMiddleware, isAdmin, getCategories);
categoryRouter.put("/update-category", authMiddleware, isAdmin, updateCategory);
categoryRouter.delete(
  "/delete-category/:id",
  authMiddleware,
  isAdmin,
  deleteCategory
);

module.exports = { categoryRouter };
