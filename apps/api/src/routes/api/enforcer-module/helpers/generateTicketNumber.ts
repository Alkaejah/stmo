import dbTickets from "@/models/dbTickets";

const MAX_TICKET_NUMBER = 999_999_999;

const generateTicketNumber = async (): Promise<string> => {
  let ticketNumber: string = "000000001";
  let isUnique = false;

  while (!isUnique) {
    const lastTicket = await dbTickets.findOne().sort({ ticketNumber: -1 });
    if (lastTicket && lastTicket.ticketNumber) {
      let nextNumber = parseInt(lastTicket.ticketNumber, 10) + 1;

      if (nextNumber > MAX_TICKET_NUMBER) {
        nextNumber = 1;
      }

      ticketNumber = nextNumber.toString().padStart(9, "0");
    }

    const existingTicket = await dbTickets.findOne({ ticketNumber });

    if (!existingTicket) {
      isUnique = true;
    }
  }

  return ticketNumber;
};

export default generateTicketNumber;
