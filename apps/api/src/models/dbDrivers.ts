import mongoose, { Schema } from "mongoose";

const roles = ["Driver", "Admin"];

const drivers = new Schema({
  driverControlNumber: String,
  profilePicture: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Photos",
    },
  ],
  firstName: String,
  lastName: String,
  address: {
    type: mongoose.Schema.ObjectId,
    ref: "Address",
  },
  dateOfBirth: Date,
  username: String,
  password: String,
  violationCount: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    enum: roles,
    default: "Driver",
    required: false,
  },
  isVerified: Boolean,
  deactivated: {
    type: Boolean,
    default: false,
  },
  isDriver: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  changePasswordAt: Date,
  updatedAt: Date,
  deactivatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("Drivers", drivers);
