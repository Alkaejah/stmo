import { createClient } from "redis";
import { REDIS_URL } from "../constants/ev";

const redisClient = createClient({
  url: REDIS_URL,
  pingInterval: 1000 * 60 * 60,
});

redisClient.connect();

redisClient.on("connect", function () {
  console.log("🟢 Connected to REDIS Database");
});

redisClient.on("reconnecting", function () {
  console.log("🟠 Trying to connect to REDIS Client...");
});

redisClient.on("ready", function () {
  console.log("🟢 REDIS Client is ready");
});

redisClient.on("error", function (err) {
  console.log("🔴 Something went wring with REDIS " + err);
});

redisClient.on("end", function () {
  console.log("\n🔗 REDIS client disconnected");
  console.log("⚠️ REDIS server is going down now...");
  process.exit();
});

export default redisClient;
