import mongoose, { Schema } from "mongoose";

const barangay = new Schema({
  barangay: String,
  longitude: Number,
  latitude: Number,
});

const street = new Schema({
  street: String,
  longitude: Number,
  latitude: Number,
});

const violationAddress = new Schema({
  street: street,
  barangay: barangay,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("ViolationAddress", violationAddress);
