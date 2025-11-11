import { z } from "zod";
import { Z_BackendResponse } from "./zod";

export type T_BackendResponse = z.infer<typeof Z_BackendResponse>;
