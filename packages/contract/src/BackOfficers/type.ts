import { z } from "zod";
import {
  Z_Add_Back_Officers,
  Z_Back_Officer_Change_Password,
  Z_Back_Officer_Forgot_Password,
  Z_Back_Officer_Login,
  Z_Back_Officer_Register,
  Z_Back_Officer_Verify_Forgot_Password,
  Z_Back_Officers,
  Z_Update_Account_Status,
  Z_Update_Back_Officer_Personal_Info,
  Z_Update_Enforcer_Assignment,
  Z_Update_Enforcer_Schedule_Time,
} from "./zod";

export type T_Back_Officers = z.infer<typeof Z_Back_Officers>;
export type T_Back_Officer_Register = z.infer<typeof Z_Back_Officer_Register>;
export type T_Back_Officer_Login = z.infer<typeof Z_Back_Officer_Login>;
export type T_Add_Back_Officers = z.infer<typeof Z_Add_Back_Officers>;
export type T_Update_Back_Officer_Personal_Info = z.infer<
  typeof Z_Update_Back_Officer_Personal_Info
>;
export type T_Back_Officer_Forgot_Password = z.infer<
  typeof Z_Back_Officer_Forgot_Password
>;
export type T_Back_Officer_Change_Password = z.infer<
  typeof Z_Back_Officer_Change_Password
>;
export type T_Back_Officer_Verify_Forgot_Password = z.infer<
  typeof Z_Back_Officer_Verify_Forgot_Password
>;
export type T_Update_Enforcer_Assignment = z.infer<
  typeof Z_Update_Enforcer_Assignment
>;

export type T_Update_Account_Status = z.infer<typeof Z_Update_Account_Status>;
export type T_Update_Enforcer_Schedule_Time = z.infer<
  typeof Z_Update_Enforcer_Schedule_Time
>;
