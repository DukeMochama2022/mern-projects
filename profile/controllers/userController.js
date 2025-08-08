const User = require("../models/User");

//get-profile

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// update-profile
const createUpdateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio, profilePicture, address } =
      req.body;
    let profile = await User.findOne({ user: req.user._id }).select("-password");

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.bio = bio;
      profile.profilePicture = profilePicture;
      profile.phone = phone;
      profile.address = address;

      await profile.save();
      return res.status(200).json({ success: true, profile });
    } else {
      profile = new User({
        user: req.user._id,
        firstName,
        lastName,
        bio,
        profilePicture,
        phone,
        address,
      });

      await profile.save();
      return res.status(201).json({ success: true, profile });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = { getProfile, createUpdateProfile };
