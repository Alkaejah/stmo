import {
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbViolations from "@/models/dbViolations";
import { T_Violation } from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();

export const addViolation = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const {
    violationCategory,
    violationCode,
    violationDescription,
  }: T_Violation = req.body;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const newViolation = await dbViolations.create({
      violationCategory,
      violationCode,
      violationDescription,
    });

    const savedViolation = newViolation.save();
    res.json(
      response.success({
        item: savedViolation,
        message: "New violation created successfully!",
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

export const getAllViolations = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const violations = await dbViolations
      .find()
      .populate({ path: "violationCategory", select: "violationCategoryName" });

    if (!violations) {
      return res.json(
        response.error({
          message: NO_RECORD_FOUND,
        }),
      );
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
