const express = require("express");
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");
const {
  createBooking,
  viewMyBookings,
  getBookingById,
  cancelBooking,
  checkAvailability,
} = require("../../controllers/bookingController");
const bookingRouter = express.Router();

// User routes (require authentication)
bookingRouter.post("/create", authMiddleware, createBooking);
bookingRouter.get("/my-bookings", authMiddleware, viewMyBookings);
bookingRouter.get("/:id", authMiddleware, getBookingById);
bookingRouter.put("/cancel/:id", authMiddleware, cancelBooking);
bookingRouter.get("/check-availability", authMiddleware, checkAvailability);

module.exports = { bookingRouter };
