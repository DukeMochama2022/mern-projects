const User = require("../models/User");
//get all users admins only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error!" });
  }
};

//managing users in the system
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    //prevent admins from deleting themselves
    if (req.user.id.toString() == id) {
      return res.status(400).json({
        success: false,
        message: "You cannnot delete  your own account!",
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successifuly!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = {getAllUsers,deleteUser};
