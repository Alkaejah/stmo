import { NextFunction, Request, Response } from "express";
import { ResponseService } from "@/common/services/response";
import { T_Session } from "@repo/contract";
import { UNKNOWN_ERROR_OCCURRED, NOT_AUTHORIZED } from "@/common/constants";
import { SESSION, CSRF } from "@repo/constants";
import redisClient from "@/common/utils/redisClient";
import dbDrivers from "@/models/dbDrivers";

const response = new ResponseService();

interface IPhoto {
  key: string;
  thumbKey?: string;
  description?: string;
  tags?: string[];
}

const isDriverLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sessionCookie = req.cookies[SESSION];
  const csrfCookie = req.cookies[CSRF];

  console.log("Session Cookie:", sessionCookie);
  console.log("CSRF Cookie:", csrfCookie);
  if (sessionCookie) {
    try {
      const session = await redisClient.hGetAll(
        `${sessionCookie}:${csrfCookie}`,
      );

      //TODO: populate necessary fields here
      const driver = await dbDrivers
        .findOne({
          _id: session?.driverId,
          deletedAt: null,
          deactivated: false,
        })
        .populate({
          path: "profilePicture",
          select: "key",
        });

      if (!driver) {
        return res.json(
          response.error({
            message: NOT_AUTHORIZED,
          }),
        );
      }

      const populatedProfilePictures =
        driver?.profilePicture as unknown as IPhoto[];

      const authDriver: T_Session = {
        //TODO: Fix the populate of profile picture if needed
        isDriver: driver?.isDriver as boolean,
        id: String(driver?._id),
        profilePicture: Array.isArray(populatedProfilePictures)
          ? populatedProfilePictures.map((photo) => ({
              key: photo.key,
              thumbKey: photo.thumbKey || "",
              description: photo.description || "",
              tags: Array.isArray(photo.tags) ? photo.tags.join(", ") : "",
            }))
          : null,
        username: driver?.username as string,
        driverControlNumber: driver?.driverControlNumber as string,
        role: driver?.role as string,
        deactivated: driver?.deactivated as boolean,
        changePasswordAt: String(driver?.changePasswordAt),
      };

      res.locals.driver = authDriver;

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

export default isDriverLoggedIn;
