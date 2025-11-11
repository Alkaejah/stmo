import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Import cron job
import "./job/notificationChecker";

const app = express();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
