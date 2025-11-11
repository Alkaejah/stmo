import mongoose, { Schema } from "mongoose";

const violatorAddress = new Schema({
  municipality: String,
  cityProvince: String,
});

const violationAddress = new Schema({
  street: String,
  barangay: String,
  longitude: Number,
  latitude: Number,
});

const historicalTickets = new Schema({
  violatorAddress: {
    type: violatorAddress,
  },
  violationAddress: {
    type: violationAddress,
  },
  violationCode: String,
  violationDescription: String,
  offense: String,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("HistoricalTickets", historicalTickets);
