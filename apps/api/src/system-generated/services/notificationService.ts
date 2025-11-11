import dbNotifications from "@/models/dbNotifications";
import dbTickets from "@/models/dbTickets";
import { E_Notification_Categories, E_Ticket_Status } from "@repo/contract";

export const getTicketsExceeding72Hours = async () => {
  const currentTime = new Date();

  // Find tickets older than 72 hours with Pending status
  return await dbTickets
    .find({
      ticketStatus: "Pending",
      // 72-HOURS CHECKING
      //   createdAt: { $lt: new Date(currentTime.getTime() - 72 * 60 * 60 * 1000) },

      // 2-MINUTES CHECKING FOR TESTING PURPOSES
      createdAt: { $lt: new Date(currentTime.getTime() - 5 * 60 * 1000) },
    })
    .populate("driver", "_id");
};

export const sendNotification = async (ticket: any) => {
  const driverId = ticket.driver?._id;

  // Skip if no driver associated
  if (!driverId) {
    console.log(`No driver associated with ticket #: ${ticket.ticketNumber}`);
    return;
  }

  // Create a new notification for exceeding the 72-hour period
  console.log(
    `Urgent notification was sent to driver with ticket #: ${ticket.ticketNumber}`,
  );
  await dbNotifications.create({
    category: E_Notification_Categories.UR,
    driver: ticket.driver,
    ticket: ticket._id,
    subject: "Urgent: Ticket Violation Exceeds 72-Hours Deadline",
  });

  // Update ticket status to "Exceeded"
  ticket.ticketStatus = E_Ticket_Status.Exceeded;
  console.log(`Ticket #: ${ticket.ticketNumber} Exceeded`);
  await ticket.save();
};
