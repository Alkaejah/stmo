import mongoose, { Schema } from "mongoose";

const ticketStatusEnum = ["Pending", "Confirmed", "Exceeded"];
const paymentStatusEnum = ["Pending", "Paid"];

const tickets = new Schema({
  ticketNumber: String,
  driver: {
    type: mongoose.Schema.ObjectId,
    ref: "Drivers",
  },
  enforcer: {
    type: mongoose.Schema.ObjectId,
    ref: "BackOfficers",
  },
  receipt: {
    type: mongoose.Schema.ObjectId,
    ref: "Receipts",
    default: null,
  },
  address: {
    type: mongoose.Schema.ObjectId,
    ref: "ViolationAddress",
  },
  licenseNumber: String,
  plateNumber: String,
  driverControlNumber: String,
  violations: [
    {
      violationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Violations",
        required: true,
      },
      penaltyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Penalties",
        required: true,
      },
    },
  ],
  otherViolations: [
    {
      violationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Violations",
        required: true,
      },
      violationDescription: String,
      penaltyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Penalties",
        required: true,
      },
    },
  ],
  ticketStatus: {
    type: String,
    enum: ticketStatusEnum,
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    enum: paymentStatusEnum,
    default: "Pending",
  },
  proof: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Photos",
    },
  ],
  enforcerSignature: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Photos",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("Tickets", tickets);
