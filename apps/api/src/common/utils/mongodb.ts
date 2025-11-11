import mongoose from "mongoose";
import { MONGO_URL } from "../constants/ev";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("🟢 Connected to MongoDB"))
  .catch((err) => console.log("🔴 Error while connecting to MongoDB: " + err));
