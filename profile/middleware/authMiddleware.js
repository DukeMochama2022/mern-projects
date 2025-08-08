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
      req.user = { id: tokenDecode.id };
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

module.exports = authMiddleware;
