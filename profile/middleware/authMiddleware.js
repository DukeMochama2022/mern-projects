const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ success: false, message: "Not authorized login again!" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (tokenDecode.id) {
      req.user = { id: tokenDecode.id, role: tokenDecode.role };
    } else {
      return res.json({
        success: false,
        message: "Not authorized login again!",
      });
    }
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied: Admins only!" });
  }
  next();
};

module.exports = { authMiddleware, isAdmin };
