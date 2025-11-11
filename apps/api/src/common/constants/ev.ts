import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../../../.env") });

// export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 9000;
export const PORT = process.env.PORT || 9000;
export const CSRF_SIGN_KEY = process.env.CSRF_SIGN_KEY || "";
export const BACKOFFICE_PASSWORD_ENCRYPT_KEY =
  process.env.BACKOFFICE_PASSWORD_ENCRYPT_KEY || "";
export const PASSWORD_ENCRYPT_KEY = process.env.PASSWORD_ENCRYPT_KEY || "";
export const BACKOFFICE_CSRF_SIGN_KEY =
  process.env.BACKOFFICE_CSRF_SIGN_KEY || "";
export const API_URL = process.env.API_URL || "";
export const ALLOWED_CLIENTS = process.env.ALLOWED_CLIENTS?.split(
  ",",
) as unknown as string;
export const MONGO_URL = process.env.MONGO_URL as unknown as string;
export const REDIS_URL = process.env.REDIS_URL || "";
export const WEB_URL = process.env.WEB_URL || "";
export const NODE_ENV = process.env.NODE_ENV || "";
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
export const AWS_REGION = process.env.AWS_REGION || "";
