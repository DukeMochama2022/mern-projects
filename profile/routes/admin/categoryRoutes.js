const express = require("express");
const categoryRouter = express.Router();
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../../controllers/categoryController");

const { createService } = require("../../controllers/serviceController");

categoryRouter.post("/create-service", authMiddleware, isAdmin, createService);
categoryRouter.post(
  "/create-category",
  authMiddleware,
  isAdmin,
  createCategory
);
categoryRouter.get("/get-categories", authMiddleware, isAdmin, getCategories);
categoryRouter.delete(
  "/delete-category/:id",
  authMiddleware,
  isAdmin,
  deleteCategory
);

module.exports = { categoryRouter };
