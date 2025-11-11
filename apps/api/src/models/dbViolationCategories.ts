import mongoose, { Schema } from "mongoose";

const violationCategories = new Schema({
  violationCategoryName: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("ViolationCategories", violationCategories);
