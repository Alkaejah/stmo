import z from "zod";

export const Z_Photo = z.object({
  _id: z.number().optional(),
  eventId: z.number().optional(),
  driverId: z.number().optional(),
  activityId: z.number().optional(),
  gameFowlMaterialId: z.number().optional(),
  advertiserId: z.number().optional(),
  advertisementId: z.number().optional(),
  key: z.string().optional(),
  thumbKey: z.string().nullable().optional(),
  description: z.string(),
  tags: z.string(),
  isDeleted: z.boolean().optional(),
  isMain: z.union([z.boolean(), z.string()]).optional(),
  file: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const Z_Update_Photo = z.object({
  description: z.string(),
  tags: z.string(),
  isMain: z.union([z.boolean(), z.string()]).optional(),
});
