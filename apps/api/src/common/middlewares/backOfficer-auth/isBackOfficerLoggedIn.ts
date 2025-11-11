import { NextFunction, Request, Response } from "express";
import { ResponseService } from "@/common/services/response";
import { UNKNOWN_ERROR_OCCURRED, NOT_AUTHORIZED } from "@/common/constants";
import { BACKOFFICE_SESSION, BACKOFFICE_CSRF } from "@repo/constants";
import redisClient from "@/common/utils/redisClient";
import { T_Back_Office_Session } from "@repo/contract";
import dbBackOfficers from "@/models/dbBackOfficers";

const response = new ResponseService();

interface IPhoto {
  key: string;
  thumbKey?: string;
  description?: string;
  tags?: string[];
}

const isBackOfficerLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const backOfficeSessionCookie = req.cookies[BACKOFFICE_SESSION];
  const backOfficeCsrfCookie = req.cookies[BACKOFFICE_CSRF];

  console.log("Back Office Session Cookie:", backOfficeSessionCookie); // Debugging statement
  console.log("Back Office CSRF Cookie:", backOfficeCsrfCookie); // Debugging statement
  if (backOfficeSessionCookie) {
    try {
      const backOfficeSession = await redisClient.hGetAll(
        `${backOfficeSessionCookie}:${backOfficeCsrfCookie}`,
      );

      //TODO: populate necessary fields here
      const backOfficer = await dbBackOfficers
        .findOne({
          _id: backOfficeSession?.backOfficerId,
          deletedAt: null,
          deactivated: false,
        })
        .populate({
          path: "profilePicture",
          select: "key",
        });

      if (!backOfficer) {
        return res.json(
          response.error({
            message: NOT_AUTHORIZED,
          }),
        );
      }

      const populatedProfilePictures =
        backOfficer?.profilePicture as unknown as IPhoto[];

      const authBackOfficer: T_Back_Office_Session = {
        //TODO: Fix the populate of profile picture if needed
        isBackOfficer: backOfficer?.isBackOfficer as boolean,
        id: String(backOfficer?._id),
        profilePicture: Array.isArray(populatedProfilePictures)
          ? populatedProfilePictures.map((photo) => ({
              key: photo.key,
              thumbKey: photo.thumbKey || "",
              description: photo.description || "",
              tags: Array.isArray(photo.tags) ? photo.tags.join(", ") : "",
            }))
          : null,
        backOfficerControlNumber:
          backOfficer?.backOfficerControlNumber as string,
        username: backOfficer?.username as string,
        role: backOfficer?.role as string,
        deactivated: backOfficer?.deactivated as boolean,
        changePasswordAt: String(backOfficer?.changePasswordAt),
      };

      res.locals.backOfficer = authBackOfficer;

      next();
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

export default isBackOfficerLoggedIn;
