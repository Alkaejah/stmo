import {
  NOT_AUTHORIZED,
  UNKNOWN_ERROR_OCCURRED,
  DRIVER_NOT_EXIST,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbDrivers from "@/models/dbDrivers";
import { T_Update_Personal_Info } from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();

export const getPersonalInfo = async (req: Request, res: Response) => {
  const driverId = req.params.driverId;
  try {
    const getDriverInfo = await dbDrivers.findOne({ _id: driverId });

    if (!getDriverInfo) {
      res.json(
        response.success({ message: "No driver found with the provided ID" }),
      );
    } else {
      const plainDriverInfo = getDriverInfo?.toObject();

      res.json(response.success({ item: plainDriverInfo }));
    }
  } catch (err: any) {
    console.error("Error fetching driver data:", err);
    res.json(
      response.error({
        message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
      }),
    );
  }
};

export const getDriverInfo = async (req: Request, res: Response) => {
  const driverId = req.params.driverId;
  const isDriver = res.locals.driver?.isDriver;

  if (!isDriver) {
    return res.json(
      response.error({
        message: NOT_AUTHORIZED,
      }),
    );
  }
  try {
    const getDriverInfo = await dbDrivers
      .findOne({ _id: driverId }, "-password -isDriver")
      .populate({
        path: "profilePicture",
        select: "key",
      });
    if (!getDriverInfo) {
      return res.json(
        response.error({
          message: DRIVER_NOT_EXIST,
        }),
      );
    }

    res.json(
      response.success({
        item: getDriverInfo,
      }),
    );
  } catch (err: any) {
    return res.json(
      response.error({
        message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
      }),
    );
  }
};

export const updatePersonalInfo = async (req: Request, res: Response) => {
  const driverId = req.params.driverId;
  const isDriver = res.locals.driver?.isDriver;

  const { firstName, lastName, username }: T_Update_Personal_Info = req.body;

  if (!isDriver) {
    return res.json(
      response.error({
        message: NOT_AUTHORIZED,
      }),
    );
  }

  try {
    const updatedPersonalInfo = await dbDrivers.findByIdAndUpdate(
      driverId,
      {
        $set: {
          firstName,
          lastName,
          username,
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updatedPersonalInfo) {
      return res.json(
        response.error({
          message: DRIVER_NOT_EXIST,
        }),
      );
    }

    res.json(
      response.success({
        item: updatedPersonalInfo,
        message: "Personal info updated successfully!",
      }),
    );
  } catch (err: any) {
    return res.json(
      response.error({
        message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
      }),
    );
  }
};
