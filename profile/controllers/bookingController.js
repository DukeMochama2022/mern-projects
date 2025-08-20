const Booking = require("../models/Booking");
const User = require("../models/User");
const Product = require("../models/Product");
const Service = require("../models/Service");

/**
 * @desc Create a new booking
 * @route POST /api/bookings
 * @access User
 */
const createBooking = async (req, res) => {
  try {
    const { products, serviceId, bookingDate, timeSlot, notes } = req.body;
    const userId = req.user.id; 

    // Validate required fields
    if (!bookingDate) {
      return res.status(400).json({
        success: false,
        message: "Booking date is required",
      });
    }

    // Validate that booking date is not in the past
    const selectedDate = new Date(bookingDate);
    const currentDate = new Date();
    if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        success: false,
        message: "Cannot book for past dates",
      });
    }

    // Validate that either products or service is provided, but not both
    if ((!products || products.length === 0) && !serviceId) {
      return res.status(400).json({
        success: false,
        message: "Please provide either products or serviceId",
      });
    }

    if (products && products.length > 0 && serviceId) {
      return res.status(400).json({
        success: false,
        message: "You can only book either products or a service, not both",
      });
    }

    let booking;
    let totalPrice = 0;

    // Handle product bookings
    if (products && products.length > 0) {
      const productItems = [];

      for (const item of products) {
        // Validate required fields for each product
        if (!item.productId || !item.productItemId || !item.quantity) {
          return res.status(400).json({
            success: false,
            message:
              "Each product must have productId, productItemId, and quantity",
          });
        }

        if (item.quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: "Quantity must be greater than 0",
          });
        }

        // Find the product
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        }

        // Find the specific product item
        const offeredItem = product.productsOffered.id(item.productItemId);
        if (!offeredItem) {
          return res.status(404).json({
            success: false,
            message: `Product item not found: ${item.productItemId}`,
          });
        }

        const price = offeredItem.price;
        totalPrice += price * item.quantity;

        productItems.push({
          productId: product._id, // Fixed: was product_.id
          price,
          quantity: item.quantity,
        });
      }

      // Create product booking
      booking = new Booking({
        customer: userId,
        products: productItems,
        quantity: productItems.reduce((sum, item) => sum + item.quantity, 0),
        bookingDate: selectedDate,
        timeSlot,
        totalPrice,
        notes,
        status: "pending",
        paymentStatus: "pending",
      });
    }

    // Handle service bookings
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      if (!service.isActive) {
        return res.status(400).json({
          success: false,
          message: "This service is currently not available",
        });
      }

      totalPrice = service.price;

      // Create service booking
      booking = new Booking({
        customer: userId,
        service: serviceId,
        bookingDate: selectedDate,
        timeSlot,
        totalPrice,
        notes,
        status: "pending",
        paymentStatus: "pending",
      });
    }

    // Save the booking
    await booking.save();

    // Populate references for response
    await booking.populate([
      { path: "customer", select: "name email" },
      { path: "service", select: "name price duration" },
      { path: "products.productId", select: "businessName" },
    ]);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc Get user's bookings
 * @route GET /api/bookings/my-bookings
 * @access User
 */
const viewMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ customer: userId })
      .populate("service", "name price duration")
      .populate("products.productId", "businessName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("View my bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @desc Get all bookings (Admin only)
 * @route GET /api/bookings/all
 * @access Admin
 */
const viewAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const bookings = await Booking.find(filter)
      .populate("customer", "name email")
      .populate("service", "name price duration")
      .populate("products.productId", "businessName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: bookings,
    });
  } catch (error) {
    console.error("View all bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @desc Cancel a booking
 * @route PUT /api/bookings/cancel/:id
 * @access User
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

   // Check if user owns the booking or is admin 
    if (booking.customer.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    // Check if booking can be cancelled
    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed booking",
      });
    }

    if (booking.status === "canceled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already canceled",
      });
    }

    // Update booking status
    booking.status = "canceled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking canceled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @desc Get single booking details
 * @route GET /api/bookings/:id
 * @access User/Admin
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(id)
      .populate('customer', 'name email phone')
      .populate('service', 'name price duration bus_name')
      .populate('products.productId', 'businessName location');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Check if user owns the booking or is admin
    if (booking.customer._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking"
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * @desc Update booking status (Admin only)
 * @route PUT /api/bookings/:id/status
 * @access Admin
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    // Validate status values
    const validStatuses = ['pending', 'confirmed', 'completed', 'canceled'];
    const validPaymentStatuses = ['pending', 'paid', 'failed'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status value"
      });
    }

    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Update fields
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * @desc Check service availability for a specific date and time
 * @route GET /api/bookings/check-availability
 * @access User
 */
const checkAvailability = async (req, res) => {
  try {
    const { serviceId, date, timeSlot } = req.query;

    if (!serviceId || !date) {
      return res.status(400).json({
        success: false,
        message: "Service ID and date are required"
      });
    }

    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    // Check existing bookings for the service on the selected date
    const existingBookings = await Booking.find({
      service: serviceId,
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['canceled'] }
    });

    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    // Calculate available time slots (assuming 1-hour slots)
    const availableSlots = [];
    const businessHours = { start: 9, end: 18 }; // 9 AM to 6 PM

    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      const slot = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
      
      // Check if this slot is available
      const isBooked = existingBookings.some(booking => 
        booking.timeSlot === slot
      );

      if (!isBooked) {
        availableSlots.push(slot);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        service: {
          name: service.name,
          duration: service.duration,
          price: service.price
        },
        date: date,
        availableSlots,
        existingBookings: existingBookings.length
      }
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  createBooking,
  viewMyBookings,
  viewAllBookings,
  cancelBooking,
  getBookingById,
  updateBookingStatus,
  checkAvailability,
};
