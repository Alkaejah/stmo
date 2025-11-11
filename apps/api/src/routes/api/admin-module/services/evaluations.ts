import {
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbBackOfficers from "@/models/dbBackOfficers";
import { E_Back_Officer_Role } from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();

export const getFeedbacksSummaryByEnforcerId = async (
  req: Request,
  res: Response,
) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const enforcerId = req.params.enforcerId;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const feedbacks = await dbBackOfficers
      .findById(
        {
          _id: enforcerId,
          role: E_Back_Officer_Role.Enforcer,
        },
        "feedbacks",
      )
      .populate({
        path: "feedbacks firstName lastName",
        populate: {
          path: "address",
          select: "street.street barangay.barangay",
        },
      });

    if (!feedbacks) {
      return res.json(
        response.error({
          message: NO_RECORD_FOUND,
        }),
      );
    }

    res.json(
      response.success({
        item: feedbacks,
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

export const getAllReceivedFeedbacksByEnforcerId = async (
  req: Request,
  res: Response,
) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const enforcerId = req.params.enforcerId;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const feedbacks = await dbBackOfficers
      .findById(
        {
          _id: enforcerId,
          role: E_Back_Officer_Role.Enforcer,
        },
        "feedbacks",
      )
      .populate({
        path: "feedbacks firstName lastName",
        select: "-whyApprehensionIsInAccurate -comments",
        populate: {
          path: "address",
          select: "street.street barangay.barangay",
        },
      });

    if (!feedbacks) {
      return res.json(
        response.error({
          message: NO_RECORD_FOUND,
        }),
      );
    }

    res.json(
      response.success({
        item: feedbacks,
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

export const getAllEnforcersForEvaluation = async (
  req: Request,
  res: Response,
) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const officers = await dbBackOfficers
      .find(
        { role: E_Back_Officer_Role.Enforcer },
        "firstName lastName deactivated assignment",
      )
      .populate({
        path: "assignment",
        select: "street.street barangay.barangay",
      });

    if (!officers) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    // ✅ Map to include only the current (last) assignment
    const mappedOfficers = officers.map((officer) => {
      const assignments = Array.isArray(officer.assignment)
        ? officer.assignment
        : [];

      const currentAssignment =
        assignments.length > 0 ? assignments[assignments.length - 1] : null;

      return {
        _id: officer._id,
        firstName: officer.firstName,
        lastName: officer.lastName,
        deactivated: officer.deactivated,
        assignment: currentAssignment, // ✅ only the most recent one
      };
    });

    res.json(
      response.success({
        items: mappedOfficers,
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

export const getAllDriversFeedbacks = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const feedbacks = await dbBackOfficers
      .find(
        { role: E_Back_Officer_Role.Enforcer },
        "-backOfficerControlNumber -profilePicture -password -isBackOfficer",
      )
      .populate("feedbacks");

    if (!feedbacks) {
      return res.json(
        response.error({
          message: NO_RECORD_FOUND,
        }),
      );
    }

    res.json(
      response.success({
        items: feedbacks,
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
