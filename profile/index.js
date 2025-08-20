const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const { router } = require("./routes/users/authRoutes");
const { userRouter } = require("./routes/users/userRoutes");
const { categoryRouter } = require("./routes/admin/categoryRoutes");
const { serviceRouter } = require("./routes/admin/serviceRoutes");
const { productRouter } = require("./routes/admin/productRoutes");
const adminRouter = require("./routes/admin/adminRoutes");
const { bookingRouter } = require("./routes/users/bookingRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());

//API endpoint
app.get("/", (req, res) => {
  res.send("API working!");
});

app.use("/api/admin", adminRouter);
app.use("/api/auth", router);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/services", serviceRouter);
app.use("/api/products", productRouter);
app.use("/api/bookings", bookingRouter);

const PORT = 5000 || process.env.PORT;
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
