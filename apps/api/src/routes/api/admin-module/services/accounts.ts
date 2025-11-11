import {
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbBackOfficers from "@/models/dbBackOfficers";
import dbDrivers from "@/models/dbDrivers";
import { T_Update_Account_Status } from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();

export const getAllDriversAccount = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const drivers = await dbDrivers
      .find(
        {},
        "driverControlNumber firstName lastName username deactivated createdAt updatedAt deactivatedAt",
      )
      .populate({
        path: "address",
        select: "street barangay municipality province",
      });

    if (!drivers) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: drivers,
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

export const getAllBackOfficersAccount = async (
  req: Request,
  res: Response,
) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const officers = await dbBackOfficers.find(
      {},
      "backOfficerControlNumber firstName lastName username role deactivated createdAt updatedAt deactivatedAt",
    );
    if (!officers) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: officers,
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

export const deactivateDriverAccount = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const driverId = req.params.driverId;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  const { deactivate }: T_Update_Account_Status = req.body;
  try {
    const deactivatedDriver = await dbDrivers.findOneAndUpdate(
      { _id: driverId },
      {
        $set: {
          deactivated: deactivate,
          deactivatedAt: new Date(),
        },
      },
      { new: true },
    );
    if (!deactivatedDriver) {
      return res.json(response.error({ message: RECORD_DOES_NOT_EXIST }));
    }

    res.json(
      response.success({
        item: deactivatedDriver,
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

export const deactivateBackOfficerAccount = async (
  req: Request,
  res: Response,
) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const backOfficerId = req.params.backOfficerId;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  const { deactivate }: T_Update_Account_Status = req.body;
  try {
    const deactivatedOfficer = await dbBackOfficers.findOneAndUpdate(
      { _id: backOfficerId },
      {
        $set: {
          deactivated: deactivate,
          deactivatedAt: new Date(),
        },
      },
      { new: true },
    );
    if (!deactivatedOfficer) {
      return res.json(response.error({ message: RECORD_DOES_NOT_EXIST }));
    }

    res.json(
      response.success({
        item: deactivatedOfficer,
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
