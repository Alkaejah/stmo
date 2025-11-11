import { z } from "zod";
import {
  Z_Add_Driver,
  Z_Change_Password,
  Z_Driver_Register,
  Z_Drivers,
  Z_Forgot_Password,
  Z_Update_Personal_Info,
  Z_Verify_Forgot_Password,
} from "./zod";

export type T_Drivers = z.infer<typeof Z_Drivers>;
export type T_Driver_Register = z.infer<typeof Z_Driver_Register>;
export type T_Update_Personal_Info = z.infer<typeof Z_Update_Personal_Info>;
export type T_Change_Password = z.infer<typeof Z_Change_Password>;
export type T_Verify_Forgot_Password = z.infer<typeof Z_Verify_Forgot_Password>;
export type T_Forgot_Password = z.infer<typeof Z_Forgot_Password>;
export type T_Add_Driver = z.infer<typeof Z_Add_Driver>;
