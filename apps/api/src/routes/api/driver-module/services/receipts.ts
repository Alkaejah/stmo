import { Request, Response } from "express";
import dbReceipts from "@/models/dbReceipts";
import { ResponseService } from "@/common/services/response";
import {
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
const response = new ResponseService();

export const getReceptById = async (req: Request, res: Response) => {
  const isDriver = res.locals.driver?.isDriver;
  const driverId = res.locals.driver?.id;
  const receiptId = req.params.receiptId;

  if (!isDriver && !driverId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const receipt = await dbReceipts
      .findOne({ _id: receiptId, payor: driverId }) // Replace `receiptId` with the actual query
      .populate({ path: "payor", select: "firstName lastName" })
      .populate({ path: "collectingOfficer", select: "firstName lastName" })
      .populate({
        path: "natureOfCollection",
        select: "violations otherViolations",
        populate: [
          {
            path: "violations",
            select: "violationId penaltyId",
            populate: [
              {
                path: "violationId",
                select: "violationCategory violationDescription violationCode",
                populate: {
                  path: "violationCategory",
                  select: "violationCategoryName",
                },
              },
              {
                path: "penaltyId",
                select: "penaltyDescription penalty ",
              },
            ],
          },
          {
            path: "otherViolations",
            populate: [
              {
                path: "violationId",
                select: "violationCategory violationCode",
                populate: {
                  path: "violationCategory",
                  select: "violationCategoryName",
                },
              },
              {
                path: "penaltyId",
                select: "penaltyDescription penalty",
              },
            ],
          },
        ],
      });

    if (!receipt) {
      return res.json(
        response.error({
          message: RECORD_DOES_NOT_EXIST,
        }),
      );
    }

    res.json(
      response.success({
        item: receipt,
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
