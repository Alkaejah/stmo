import {
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbViolationCategories from "@/models/dbViolationCategories";
import {
  T_Update_Violation_Category,
  T_Violation_Category,
} from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();

export const addViolationCategory = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const { violationCategoryName }: T_Violation_Category = req.body;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const newViolationCategory = await dbViolationCategories.create({
      violationCategoryName,
    });

    const savedViolationCategory = newViolationCategory.save();
    res.json(
      response.success({
        item: savedViolationCategory,
        message: "New violation category created successfully!",
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

export const updateViolationCategory = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const violationCategoryId = req.params.violationCategoryId;
  const { violationCategoryName }: T_Update_Violation_Category = req.body;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const updateViolationCategory =
      await dbViolationCategories.findByIdAndUpdate(
        violationCategoryId,
        {
          $set: {
            violationCategoryName,
            updatedAt: new Date(),
          },
        },
        { new: true },
      );

    if (!updateViolationCategory) {
      return res.json(
        response.error({
          message: RECORD_DOES_NOT_EXIST,
        }),
      );
    }

    res.json(
      response.success({
        item: updateViolationCategory,
        message: "Violation category updated successfully!",
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

export const deleteViolationCategory = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const violationCategoryId = req.params.violationCategoryId;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const deletedViolationCategory =
      await dbViolationCategories.findByIdAndDelete(violationCategoryId);
    if (!deletedViolationCategory) {
      return res.json(
        response.error({
          message: RECORD_DOES_NOT_EXIST,
        }),
      );
    }
    res.json(
      response.success({
        item: deletedViolationCategory,
        message: "Violation category deleted successfully!",
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

export const getAllViolationCategories = async (
  req: Request,
  res: Response,
) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const violationCategories = await dbViolationCategories.find({});
    if (!violationCategories) {
      return res.json(
        response.error({
          message: NO_RECORD_FOUND,
        }),
      );
    }
    res.json(
      response.success({
        items: violationCategories,
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

export const getViolationCategoryById = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const violationCategoryId = req.params.violationCategoryId;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const violationCategory =
      await dbViolationCategories.findById(violationCategoryId);
    if (!violationCategory) {
      return res.json(
        response.error({
          message: RECORD_DOES_NOT_EXIST,
        }),
      );
    }
    res.json(
      response.success({
        item: violationCategory,
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
