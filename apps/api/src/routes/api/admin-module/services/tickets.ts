import {
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbTickets from "@/models/dbTickets";
import { Request, Response } from "express";

const response = new ResponseService();
export const getAllTicketsForAdmin = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  // const enforcerId = res.locals.backOfficer?.id;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const tickets = await dbTickets
      .find({}, "-proof -enforcerSignature")
      .populate({ path: "driver", select: "firstName lastName" })
      .populate({
        path: "receipt",
        select: "receiptNumber agency total amountInWords",
        populate: { path: "collectingOfficer", select: "firstName lastName" },
      })
      .populate({
        path: "enforcer",
        select: "firstName lastName",
      })
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
      .populate({
        path: "address",
        select: "street barangay",
      });

    if (!tickets) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: tickets,
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

export const getTicketByIdForAdmin = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  // const enforcerId = res.locals.backOfficer?.id;
  const ticketId = req.params.ticketId;

  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const ticket = await dbTickets
      .findOne({ _id: ticketId })
      .populate({
        path: "driver",
        select: "firstName lastName address dateOfBirth violationCount role",
        populate: {
          path: "address",
          select: "street barangay municipality province",
        },
      })
      .populate({ path: "proof", select: "key" })
      .populate({ path: "enforcerSignature", select: "key" })
      .populate({
        path: "enforcer",
        select: "firstName lastName",
      })
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
      .populate({
        path: "address",
        select: "street barangay",
      });

    if (!ticket) {
      return res.json(response.error({ message: RECORD_DOES_NOT_EXIST }));
    }

    res.json(
      response.success({
        item: ticket,
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

export const getAllTickets = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  // const enforcerId = res.locals.backOfficer?.id;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const tickets = await dbTickets
      .find(
        {},
        "ticketNumber createdAt licenseNumber plateNumber paymentStatus ticketStatus",
      )
      .populate({ path: "driver", select: "firstName lastName" })
      .populate("address")
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
      });

    if (!tickets) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: tickets,
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

export const getAllTicketsForVisualization = async (
  req: Request,
  res: Response,
) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  // const enforcerId = res.locals.backOfficer?.id;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const tickets = await dbTickets
      .find(
        {},
        "ticketNumber createdAt licenseNumber plateNumber paymentStatus ticketStatus",
      )
      .populate({
        path: "driver",
        select: "firstName lastName address",
        populate: {
          path: "address",
          select: "street barangay municipality province",
        },
      })
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
      .populate("address");

    if (!tickets) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: tickets,
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
