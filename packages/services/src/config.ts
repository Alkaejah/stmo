import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

export const PASSWORD_ENCRYPT_KEY = process.env.PASSWORD_ENCRYPT_KEY || "";
export const CSRF_SIGN_KEY = process.env.CSRF_SIGN_KEY || "";
export const BACKOFFICE_CSRF_SIGN_KEY =
  process.env.BACKOFFICE_CSRF_SIGN_KEY || "";
export const BACKOFFICE_PASSWORD_ENCRYPT_KEY =
  process.env.BACKOFFICE_PASSWORD_ENCRYPT_KEY || "";
