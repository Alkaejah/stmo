import mongoose, { Schema } from "mongoose";

const receipts = new Schema({
  receiptNumber: String,
  agency: String,
  collectingOfficer: {
    type: mongoose.Schema.ObjectId,
    ref: "BackOfficers",
  },
  payor: {
    type: mongoose.Schema.ObjectId,
    ref: "Drivers",
  },
  natureOfCollection: {
    type: mongoose.Schema.ObjectId,
    ref: "Tickets",
  },
  total: Number,
  amountInWords: String,
  date: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("Receipts", receipts);
