import { z } from "zod";
import { Z_Violation_Address } from "../Addresses";

export const Z_Feedback = z.object({
  _id: z.string().optional().nullable(),
  isAccuratelyApprehended: z.boolean(),
  whyApprehensionIsInAccurate: z.string().optional(),
  q1: z.number(),
  q2: z.number(),
  q3: z.number(),
  q4: z.number(),
  q5: z.number(),
  q6: z.number(),
  q7: z.number(),
  q8: z.number(),
  q9: z.number(),
  q10: z.number(),
  q11: z.number(),
  address: Z_Violation_Address.optional(),
  comments: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});
