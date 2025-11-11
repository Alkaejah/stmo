import { z } from "zod";

// Violation Category
export const Z_Violation_Category = z.object({
  _id: z.string().optional().nullable(),
  violationCategoryName: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});

export const Z_Update_Violation_Category = z.object({
  violationCategoryName: z.string(),
});

// Violation
export const Z_Violation = z.object({
  _id: z.string().optional().nullable(),
  violationCategory: z.string(),
  violationCode: z.string(),
  violationDescription: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});

export const Z_Update_Violation = z.object({
  violationCategory: z.string(),
  violationCode: z.string(),
  violationDescription: z.string(),
});

// Penalty
export const Z_Penalty = z.object({
  _id: z.string().optional().nullable(),
  penaltyDescription: z.string(),
  penalty: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});

export const Z_Update_Penalty = z.object({
  penaltyDescription: z.string(),
  penalty: z.number(),
});
