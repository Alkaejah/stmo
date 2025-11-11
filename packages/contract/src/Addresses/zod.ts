import { z } from "zod";

// Address
export const Z_Address = z.object({
  _id: z.string().optional().nullable(),
  street: z.string(),
  barangay: z.string(),
  municipality: z.string(),
  province: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});

export const Z_Update_Address = z.object({
  street: z.string(),
  barangay: z.string(),
  municipality: z.string(),
  province: z.string(),
});

// Violation Address
const Z_Barangay = z.object({
  barangay: z.string(),
  longitude: z.number(),
  latitude: z.number(),
});

const Z_Street = z.object({
  street: z.string(),
  longitude: z.number(),
  latitude: z.number(),
});

export const Z_Violation_Address = z.object({
  _id: z.string().optional().nullable(),
  street: Z_Street,
  barangay: Z_Barangay,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});
