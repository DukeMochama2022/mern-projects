const express = require("express");
const adminRouter = express.Router();
const {
  getAllUsers,
  deleteUser,
} = require("../../controllers/adminController");
const { createService } = require("../../controllers/serviceController");
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");

adminRouter.get("/get-all-users", authMiddleware, isAdmin, getAllUsers);
adminRouter.delete("/delete-user/:id", authMiddleware, isAdmin, deleteUser);
adminRouter.post("/create-service", authMiddleware, isAdmin, createService);

module.exports = adminRouter;
