import mongoose, { Schema } from "mongoose";

const penalties = new Schema({
  penaltyDescription: String,
  penalty: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("Penalties", penalties);
