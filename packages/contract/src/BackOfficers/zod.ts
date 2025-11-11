import { z } from "zod";
import { E_Back_Officer_Role } from "./enum";
import { Z_Photo } from "../Photo";
import { Z_Violation_Address } from "../Addresses";

export const Z_Back_Officers = z.object({
  id: z.number(),
  backOfficerControlNumber: z.string().optional(),
  profilePicture: z.array(Z_Photo).nullable(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  password: z.string(),
  role: z.nativeEnum(E_Back_Officer_Role).optional(),
  // THIS IS THE ORIGINAL BACKUP INSTEAD IF ERROR PERSIST CAUSE OF CHANGES
  // assignment: z.string().optional(),
  assignment: Z_Violation_Address.optional(),
  isBackOfficer: z.boolean(),
  deactivated: z.boolean().optional(),
  changePasswordAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  deactivatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});

export const Z_Back_Officer_Register = z.object({
  username: z.string(),
  password: z.string(),
  role: z.nativeEnum(E_Back_Officer_Role),
  assignment: z.array(z.string()).optional(),
});

export const Z_Back_Officer_Login = z.object({
  username: z.string(),
  password: z.string(),
});

export const Z_Add_Back_Officers = z.object({
  backOfficerControlNumber: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  role: z.nativeEnum(E_Back_Officer_Role).optional(),
  assignment: z.string().optional(),
});

export const Z_Update_Back_Officer_Personal_Info = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string(),
});

export const Z_Back_Officer_Change_Password = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
});

export const Z_Back_Officer_Forgot_Password = z.object({
  backOfficerControlNumber: z.string(),
});

export const Z_Back_Officer_Verify_Forgot_Password = z.object({
  backOfficerControlNumber: z.string(),
  newPassword: z.string(),
});

export const Z_Update_Enforcer_Assignment = z.object({
  assignment: z.string(),
});

export const Z_Update_Account_Status = z.object({
  deactivate: z.boolean(),
});

export const Z_Update_Enforcer_Schedule_Time = z.object({
  scheduleTime: z.string(),
});
