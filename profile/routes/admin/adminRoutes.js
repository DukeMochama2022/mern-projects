const express = require("express");
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");
const {
  getAllUsers,
  deleteUser,
} = require("../../controllers/adminController");
const { createService } = require("../../controllers/serviceController");
const {
  viewAllBookings,
  updateBookingStatus,
} = require("../../controllers/bookingController");
const adminRouter = express.Router();

// User management routes
adminRouter.get("/get-all-users", authMiddleware, isAdmin, getAllUsers);
adminRouter.delete("/delete-user/:id", authMiddleware, isAdmin, deleteUser);

// Service management routes
adminRouter.post("/create-service", authMiddleware, isAdmin, createService);

// Booking management routes
adminRouter.get("/bookings", authMiddleware, isAdmin, viewAllBookings);
adminRouter.put(
  "/bookings/status/:id",
  authMiddleware,
  isAdmin,
  updateBookingStatus
);

module.exports = adminRouter;
