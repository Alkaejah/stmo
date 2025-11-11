// CHECKING EVERY 72-HOURS
// import cron from "node-cron";
// import {
//   getTicketsExceeding72Hours,
//   sendNotification,
// } from "./services/notificationService";
// // Schedule the cron job to run every hour (you can adjust this)
// cron.schedule("0 * * * *", async () => {
//   console.log("Notification Cron Job Started...");

//   try {
//     const tickets = await getTicketsExceeding72Hours();

//     console.log(`Found ${tickets.length} tickets exceeding 72 hours.`);

//     for (const ticket of tickets) {
//       await sendNotification(ticket);
//     }

//     console.log("Notification Cron Job Completed Successfully.");
//   } catch (err) {
//     console.error("Error during Notification Cron Job:", err);
//   }
// });

// CHECKING EVERY MINUTE FOR TESTING PURPOSES
import cron from "node-cron";
import {
  getTicketsExceeding72Hours,
  sendNotification,
} from "../services/notificationService";

// Schedule the cron job to run every minute for testing
cron.schedule("* * * * *", async () => {
  console.log("Checking Tickets...");

  try {
    const tickets = await getTicketsExceeding72Hours();

    console.log(`Found [${tickets.length}] tickets exceeding 72-Hours`);

    for (const ticket of tickets) {
      await sendNotification(ticket);
    }

    console.log("Checking of Tickets Success!");
  } catch (err) {
    console.error("Error while checking tickets:", err);
  }
});
