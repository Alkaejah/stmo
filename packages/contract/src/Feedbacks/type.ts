import { z } from "zod";
import { Z_Feedback } from "./zod";

export type T_Feedback = z.infer<typeof Z_Feedback>;
