const express = require("express");
const categoryRouter = express.Router();
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");
const {
  createCategory,
  deleteCategory,
} = require("../../controllers/categoryController");

categoryRouter.post(
  "/create-category",
  authMiddleware,
  isAdmin,
  createCategory
);
categoryRouter.delete(
  "/delete-category/:id",
  authMiddleware,
  isAdmin,
  deleteCategory
);

module.exports = { categoryRouter };
