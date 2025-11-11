import z from "zod";
import { Z_Photo, Z_Update_Photo } from "./zod";

export type T_Photo = z.infer<typeof Z_Photo>;
export type T_Update_Photo = z.infer<typeof Z_Update_Photo>;
