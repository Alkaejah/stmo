import { z } from "zod";
import {
  Z_Penalty,
  Z_Update_Penalty,
  Z_Update_Violation,
  Z_Update_Violation_Category,
  Z_Violation,
  Z_Violation_Category,
} from "./zod";

export type T_Violation_Category = z.infer<typeof Z_Violation_Category>;
export type T_Update_Violation_Category = z.infer<
  typeof Z_Update_Violation_Category
>;
export type T_Violation = z.infer<typeof Z_Violation>;
export type T_Update_Violation = z.infer<typeof Z_Update_Violation>;
export type T_Penalty = z.infer<typeof Z_Penalty>;
export type T_Update_Penalty = z.infer<typeof Z_Update_Penalty>;
