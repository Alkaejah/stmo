import mongoose, { Schema } from "mongoose";

const photos = new Schema({
  driverId: {
    type: mongoose.Schema.ObjectId,
    ref: "Drivers",
  },
  backOfficerId: {
    type: mongoose.Schema.ObjectId,
    ref: "BackOfficers",
  },
  ticketId: {
    type: mongoose.Schema.ObjectId,
    ref: "Tickets",
  },
  key: String,
  thumbKey: String,
  description: String,
  tags: String,
  isMain: {
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

export default mongoose.model("Photos", photos);
