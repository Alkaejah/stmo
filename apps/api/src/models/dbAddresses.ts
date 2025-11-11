import mongoose, { Schema } from "mongoose";

const address = new Schema({
  street: String,
  barangay: String,
  municipality: String,
  province: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("Address", address);
