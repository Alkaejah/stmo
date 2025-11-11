import { z } from "zod";
import { Z_Drivers } from "../Drivers";
import { Z_Back_Officers } from "../BackOfficers";
import { E_Payment_Status, E_Ticket_Status } from "./enum";
import { Z_Photo } from "../Photo";
import { Z_Receipt } from "../Receipts";
import { Z_Violation_Address } from "../Addresses";

const Z_Other_Violations = z.object({
  violationId: z.string(),
  violationDescription: z.string(),
  penaltyId: z.string(),
});

// Ticket
export const Z_Ticket = z.object({
  _id: z.string().optional().nullable(),
  ticketNumber: z.string().optional(),
  driver: Z_Drivers.optional(),
  enforcer: Z_Back_Officers.optional(),
  receipt: Z_Receipt.optional().nullable(),
  licenseNumber: z.string(),
  plateNumber: z.string(),
  driverControlNumber: z.string(),
  violations: z.array(z.string()),
  otherViolations: Z_Other_Violations.optional(),
  // THIS IS THE ORIGINAL BACKUP INSTEAD IF ERROR PERSIST CAUSE OF CHANGES
  // address: z.string(),
  address: Z_Violation_Address.optional(),
  proof: z.array(Z_Photo),
  ticketStatus: z.nativeEnum(E_Ticket_Status),
  paymentStatus: z.nativeEnum(E_Payment_Status),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});

// Historical Tickets
const Z_VIOLATOR_ADDRESS = z.object({
  cityProvince: z.string(),
  municipality: z.string(),
});

const Z_VIOLATION_ADDRESS = z.object({
  street: z.string(),
  barangay: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  municipality: z.string(),
});

export const Z_Historical_Ticket = z.object({
  _id: z.string().optional().nullable(),
  violatorAddress: Z_VIOLATOR_ADDRESS,
  violationAddress: Z_VIOLATION_ADDRESS,
  violationCode: z.string(),
  violationDescription: z.string(),
  penalty: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});
