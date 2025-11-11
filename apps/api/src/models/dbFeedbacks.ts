import mongoose, { Schema } from "mongoose";

const feedbacks = new Schema({
  isAccuratelyApprehended: {
    type: Boolean,
    required: true,
  },

  whyApprehensionIsInAccurate: {
    type: String,
    trim: true,
    default: "",
    required: false,
  },

  // Ratings: 1 = Poor to 5 = Excellent
  q1: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  q2: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  q3: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  q4: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  q5: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  q6: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  q7: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  q8: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  q9: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  q10: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  q11: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comments: {
    type: String,
    trim: true,
    default: "",
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ViolationAddress",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

export default mongoose.model("Feedbacks", feedbacks);
