const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfile,
  createUpdateProfile,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/get-profile", authMiddleware, getProfile);
userRouter.put("/update-profile", authMiddleware, createUpdateProfile);

module.exports = { userRouter };
