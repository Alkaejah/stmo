import { NextFunction, Request, Response } from "express";
import { ResponseService } from "@/common/services/response";
import { UNKNOWN_ERROR_OCCURRED, NOT_AUTHORIZED } from "@/common/constants";
import { BACKOFFICE_CSRF, BACKOFFICE_SESSION } from "@repo/constants";
import { EncryptionService } from "@repo/services";
import redisClient from "@/common/utils/redisClient";

const response = new ResponseService();
const backOfficeCsrfEncryption = new EncryptionService("backOfficeCsrf");

const isBackOfficeCsrfTokenValid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const backOfficeSessionCookie = req.cookies[BACKOFFICE_SESSION];
  const backOfficeCsrfCookie = req.cookies[BACKOFFICE_CSRF];
  if (backOfficeCsrfCookie && backOfficeSessionCookie) {
    try {
      const backOfficeSession = await redisClient.hGetAll(
        `${backOfficeSessionCookie}:${backOfficeCsrfCookie}`,
      );

      const decryptedCsrf = backOfficeCsrfEncryption.decrypt(
        backOfficeCsrfCookie,
      ) as {
        backOfficeSessionKey: string;
        backOfficerId: string;
      };

      if (
        decryptedCsrf.backOfficeSessionKey === backOfficeSessionCookie &&
        decryptedCsrf.backOfficerId === backOfficeSession?.backOfficerId
      ) {
        next();
      } else {
        res.json(
          response.error({
            message: NOT_AUTHORIZED,
          }),
        );
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED;
      response.error({
        message: message,
      });
    }
  } else {
    res.json(
      response.error({
        message: NOT_AUTHORIZED,
      }),
    );
  }
};

export default isBackOfficeCsrfTokenValid;
