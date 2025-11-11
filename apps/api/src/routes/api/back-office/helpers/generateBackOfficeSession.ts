import randomChar from "@/common/helpers/randomChar";
import redisClient from "@/common/utils/redisClient";
import { BACKOFFICE_CSRF, BACKOFFICE_SESSION } from "@repo/constants";
import { T_Back_Officers } from "@repo/contract";
import { EncryptionService } from "@repo/services";
import { Request, Response } from "express";

const csrfEncryption = new EncryptionService("backOfficeCsrf");

async function generateBackOfficeSession(
  req: Request,
  res: Response,
  backOfficer: T_Back_Officers,
) {
  const backOfficeSessionKey = randomChar();
  const ip =
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress;
  const backOfficeCsrf = csrfEncryption.encrypt({
    backOfficerId: backOfficer.id,
    backOfficeSessionKey: backOfficeSessionKey,
    ipAddress: ip,
  });
  await redisClient.hSet(`${backOfficeSessionKey}:${backOfficeCsrf}`, {
    backOfficerId: backOfficer.id,
    ipAddress: String(ip),
    status: "Active",
  });

  const cookieOption = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    maxAge: 24 * 60 * 60 * 1000, // Set cookie expiry to 1 day
  };
  res.cookie(BACKOFFICE_SESSION, backOfficeSessionKey, cookieOption);
  res.cookie(BACKOFFICE_CSRF, backOfficeCsrf, cookieOption);
}

export default generateBackOfficeSession;
