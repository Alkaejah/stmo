import randomChar from "@/common/helpers/randomChar";
import redisClient from "@/common/utils/redisClient";
import { CSRF, SESSION } from "@repo/constants";
import { T_Drivers } from "@repo/contract";
import { EncryptionService } from "@repo/services";
import { Request, Response } from "express";

const csrfEncryption = new EncryptionService("csrf");

async function generateSession(req: Request, res: Response, driver: T_Drivers) {
  const sessionKey = randomChar();
  const ip =
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress;
  const csrf = csrfEncryption.encrypt({
    // this object needs to be the same as db session excluding id
    driverId: driver.id,
    sessionKey: sessionKey,
    ipAddress: ip,
    // location: "",
    // device: "",
  });
  await redisClient.hSet(`${sessionKey}:${csrf}`, {
    driverId: driver.id,
    ipAddress: String(ip),
    status: "Active",
    // location: "",
    // device: "",
  });
  // const cookieOption = { httpOnly: true, secure: false, encode: String };

  const cookieOption = {
    httpOnly: true,
    secure: true, // Ensure cookies are only sent over HTTPS
    sameSite: "none" as const, // Explicitly set SameSite to "none"
    maxAge: 24 * 60 * 60 * 1000, // Set cookie expiry to 1 day
  };
  // const cookieOption = {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "none" as const,
  //   encode: String,
  // };

  res.cookie(SESSION, sessionKey, cookieOption);
  res.cookie(CSRF, csrf, cookieOption);
}

export default generateSession;
