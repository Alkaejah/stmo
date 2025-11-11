import { z } from "zod";
import { Z_Photo } from "..";

export const Z_Session = z.object({
  id: z.union([z.number().nullable(), z.string().nullable()]),
  profilePicture: z.array(Z_Photo).nullable(),
  username: z.string().nullable(),
  driverControlNumber: z.string().nullable(),
  role: z.string().nullable(),
  isDriver: z.boolean(),
  deactivated: z.boolean().nullable(),
  changePasswordAt: z.string().nullable(),
});

export const Z_Back_Office_Session = z.object({
  id: z.union([z.number().nullable(), z.string().nullable()]),
  profilePicture: z.array(Z_Photo).nullable(),
  username: z.string().nullable(),
  backOfficerControlNumber: z.string().nullable(),
  role: z.string().nullable(),
  isBackOfficer: z.boolean(),
  deactivated: z.boolean().nullable(),
  changePasswordAt: z.string().nullable(),
});
