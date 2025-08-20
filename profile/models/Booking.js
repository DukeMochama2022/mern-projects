const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The customer who made the booking
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // Optional: if booking a service
      required: false,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref:"Product"
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    quantity: {
      type: Number,
      default: 1, // for product bookings
    },
    bookingDate: {
      type: Date,
      required: true, // When the user wants the service/product
      default: Date.now,
    },
    timeSlot: {
      type: String, // e.g. "10:00 AM - 11:00 AM"
      required: false, // mainly for services
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "canceled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    notes: {
      type: String, // Extra instructions (e.g., "I prefer natural products")
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
