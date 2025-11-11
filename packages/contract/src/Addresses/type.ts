import { z } from "zod";
import { Z_Address, Z_Update_Address, Z_Violation_Address } from "./zod";

export type T_Address = z.infer<typeof Z_Address>;
export type T_Violation_Address = z.infer<typeof Z_Violation_Address>;
export type T_Update_Address = z.infer<typeof Z_Update_Address>;
