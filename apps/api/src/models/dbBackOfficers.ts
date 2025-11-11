import mongoose, { Schema } from "mongoose";

const roles = ["Admin", "Enforcer", "Treasurer"];

const backOfficers = new Schema({
  backOfficerControlNumber: String,
  profilePicture: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Photos",
    },
  ],
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  role: {
    type: String,
    enum: roles,
  },
  assignment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ViolationAddress",
      required: false,
    },
  ],
  feedbacks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Feedbacks",
    },
  ],
  scheduleTime: {
    type: String,
    default: "0:00 AM-00:00 AM/0:00 PM-0:00",
  },

  deactivated: {
    type: Boolean,
    default: false,
  },
  isBackOfficer: {
    type: Boolean,
    default: true,
  },
  changePasswordAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deactivatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("BackOfficers", backOfficers);
