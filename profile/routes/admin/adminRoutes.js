const express = require("express");
const adminRouter = express.Router();
const {
  getAllUsers,
  deleteUser,
} = require("../../controllers/adminController");
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");


adminRouter.get("/get-all-users", authMiddleware, isAdmin, getAllUsers);
adminRouter.delete("/delete-user/:id", authMiddleware, isAdmin, deleteUser);


module.exports = adminRouter;
