const express = require("express");
const { authMiddleware } = require("../../middleware/authMiddleware");
const {
  getProfile,
  createUpdateProfile,
} = require("../../controllers/userController");
const {
  getServices,
  getServiceById,
} = require("../../controllers/serviceController");
const userRouter = express.Router();

userRouter.get("/get-profile", authMiddleware, getProfile);
userRouter.put("/update-profile", authMiddleware, createUpdateProfile);

// services which are accessible to public
userRouter.get("/get-services", authMiddleware, getServices);

module.exports = { userRouter };
