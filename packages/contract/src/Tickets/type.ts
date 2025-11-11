import { z } from "zod";
import { Z_Historical_Ticket, Z_Ticket } from "./zod";

export type T_Ticket = z.infer<typeof Z_Ticket>;
export type T_Historical_Ticket = z.infer<typeof Z_Historical_Ticket>;
