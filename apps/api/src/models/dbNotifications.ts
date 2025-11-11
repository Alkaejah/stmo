import mongoose, { Schema } from "mongoose";

const notificationCategoriesEnum = ["WC", "AR", "UR", "PC"];

const notifications = new Schema({
  category: {
    type: String,
    enum: notificationCategoriesEnum,
  },
  driver: {
    type: mongoose.Schema.ObjectId,
    ref: "Drivers",
    required: false,
  },
  ticket: {
    type: mongoose.Schema.ObjectId,
    ref: "Tickets",
    required: false,
  },
  receipt: {
    type: mongoose.Schema.ObjectId,
    ref: "Receipts",
    required: false,
  },
  subject: String,
  content: String,
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("Notifications", notifications);
