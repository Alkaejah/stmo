import { z } from "zod";
import { Z_Back_Officers } from "../BackOfficers";

// Receipt
export const Z_Receipt = z.object({
  _id: z.string().optional().nullable(),
  receiptNumber: z.string(),
  agency: z.string(),
  collectingOfficer: Z_Back_Officers.optional(),
  payor: z.string(),
  ticketNumber: z.string(),
  natureOfCollection: z.array(z.string()),
  total: z.number(),
  amountInWords: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});
