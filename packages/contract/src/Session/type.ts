import { z } from "zod";
import { Z_Back_Office_Session, Z_Session } from "./zod";

export type T_Session = z.infer<typeof Z_Session>;
export type T_Back_Office_Session = z.infer<typeof Z_Back_Office_Session>;
