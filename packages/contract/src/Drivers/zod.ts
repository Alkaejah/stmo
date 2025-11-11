import { z } from "zod";
import { E_Role } from "./enum";
import { Z_Photo } from "../Photo";
import { Z_Address } from "../Addresses";

export const Z_Drivers = z.object({
  id: z.number(),
  driverControlNumber: z.string().optional(),
  profilePicture: z.array(Z_Photo).nullable(),
  firstName: z.string(),
  lastName: z.string(),
  address: Z_Address,
  dateOfBirth: z.union([z.string(), z.date()]),
  username: z.string(),
  password: z.string(),
  violationCount: z.number().optional(),
  role: z.nativeEnum(E_Role),
  isDriver: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  deactivated: z.boolean().optional(),
  changePasswordAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  deactivatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});

export const Z_Driver_Register = z.object({
  firstName: z.string(),
  lastName: z.string(),
  address: Z_Address,
  dateOfBirth: z.union([z.string(), z.date()]),
  username: z.string(),
  password: z.string(),
  isVerified: z.boolean().optional(),
});

export const Z_Add_Driver = z.object({
  driverControlNumber: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  address: Z_Address,
  dateOfBirth: z.union([z.string(), z.date()]),
  username: z.string(),
});

export const Z_Update_Personal_Info = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string(),
});

export const Z_Change_Password = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
});

export const Z_Forgot_Password = z.object({
  driverControlNumber: z.string(),
});

export const Z_Verify_Forgot_Password = z.object({
  driverControlNumber: z.string(),
  newPassword: z.string(),
});
