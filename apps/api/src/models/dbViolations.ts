import mongoose, { Schema } from "mongoose";

const violations = new Schema({
  violationCategory: {
    type: mongoose.Schema.ObjectId,
    ref: "ViolationCategories",
  },
  violationCode: String,
  violationDescription: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("Violations", violations);
