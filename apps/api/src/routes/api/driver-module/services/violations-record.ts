import {
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbReceipts from "@/models/dbReceipts";
import dbTickets from "@/models/dbTickets";
import dbViolations from "@/models/dbViolations";
import { Request, Response } from "express";

const response = new ResponseService();

export const getAllViolationsRecord = async (req: Request, res: Response) => {
  const isDriver = res.locals.driver?.isDriver;
  const driverId = res.locals.driver?.id;
  if (!isDriver || !driverId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const records = await dbTickets
      .find(
        { driver: driverId },
        "ticketNumber createdAt licenseNumber plateNumber receipt paymentStatus ticketStatus address",
      )
      .populate({ path: "driver", select: "firstName lastName" })
      .populate({
        path: "enforcer",
        select: "firstName lastName",
      })
      .populate({ path: "address", select: "street.street barangay.barangay" });

    if (!records) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: records,
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

export const getViolationRecordById = async (req: Request, res: Response) => {
  const isDriver = res.locals.driver?.isDriver;
  const driverId = res.locals.driver?.id;
  const recordId = req.params.recordId;
  if (!isDriver || !driverId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const record = await dbTickets
      .findOne({ _id: recordId })
      .populate({
        path: "driver",
        select:
          "-username -password -deactivated -isDriver -driverControlNumber -createdAt -__v -violationCount -role -profilePicture",
        populate: {
          path: "address",
          select: "-createdAt -__v",
        },
      })
      .populate({ path: "proof", select: "key" })
      .populate({ path: "enforcerSignature", select: "key" })
      .populate({ path: "enforcer", select: "firstName lastName" })
      .populate({
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
            select: "penaltyDescription penalty",
          },
        ],
      })
      .populate({
        path: "otherViolations.violationId",
        select: "violationCategory violationCode",
        populate: {
          path: "violationCategory",
          select: "violationCategoryName",
        },
      })
      .populate({
        path: "otherViolations.penaltyId",
        select: "penaltyDescription penalty",
      })
      .populate({ path: "address", select: "street barangay" });

    if (!record) {
      return res.json(response.error({ message: RECORD_DOES_NOT_EXIST }));
    }

    res.json(
      response.success({
        item: record,
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

//TODO: For modification and verification, need to populate the data
export const getReceiptByTicket = async (req: Request, res: Response) => {
  const isDriver = res.locals.driver?.isDriver;
  const driverId = res.locals.driver?.id;
  if (!isDriver || !driverId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const recordId = req.params.recordId;

    const ticket = await dbTickets.findById(recordId).select("receipt");
    if (!ticket || !ticket.receipt) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    const receipt = await dbReceipts.findById(ticket.receipt);
    if (!receipt) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(response.success({ item: receipt }));
  } catch (err: any) {
    return res.json(
      response.error({
        message: err.message || UNKNOWN_ERROR_OCCURRED,
      }),
    );
  }
};

export const getAllViolationsFromSettings = async (
  req: Request,
  res: Response,
) => {
  const isDriver = res.locals.driver?.isDriver;
  if (!isDriver) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const violations = await dbViolations
      .find({}, "-createdAt -__v")
      .populate({ path: "violationCategory", select: "violationCategoryName" });

    if (!violations) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: violations,
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
