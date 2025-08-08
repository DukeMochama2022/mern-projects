const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
app.use(express.json());
connectDB();

//API endpoint
app.get("/", (req, res) => {
  res.send("API working!");
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
