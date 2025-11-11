import { z } from "zod";
import { Z_Receipt } from "./zod";

export type T_Receipt = z.infer<typeof Z_Receipt>;
