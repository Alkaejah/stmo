import { NOT_AUTHORIZED, UNKNOWN_ERROR_OCCURRED } from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbTickets from "@/models/dbTickets";
import { Request, Response } from "express";

const response = new ResponseService();

export const getAllTicketsForDataset = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const treasurerId = res.locals.backOfficer?.id;
  if (!isBackOfficer || !treasurerId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    // Fetch tickets and populate related fields
    const tickets = await dbTickets
      .find(
        {},
        "-ticketNumber -driver -receipt -address -licenseNumber -plateNumber -ticketStatus -paymentStatus -proof -enforcerSignature",
      )
      .populate({
        path: "enforcer",
        select: "firstName lastName role assignment",
        populate: {
          path: "assignment",
          select:
            "-street.longitude -street.latitude -barangay.longitude -barangay.latitude -createdAt -updatedAt -__v",
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
      });

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
