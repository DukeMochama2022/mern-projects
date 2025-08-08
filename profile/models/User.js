const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    address: {
      type: String,
    },
  },

  { timestamps:true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
