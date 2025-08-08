const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const { router } = require("./routes/authRoutes");
const { userRouter } = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();

//API endpoint
app.get("/", (req, res) => {
  res.send("API working!");
});
app.use("/api/auth", router);
app.use("/api/user", userRouter);

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
