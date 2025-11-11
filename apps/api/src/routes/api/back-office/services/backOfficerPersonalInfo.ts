import {
  NOT_AUTHORIZED,
  UNKNOWN_ERROR_OCCURRED,
  BACKOFFICER_NOT_EXIST,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbBackOfficers from "@/models/dbBackOfficers";
import { T_Update_Back_Officer_Personal_Info } from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();

export const getPersonalInfo = async (req: Request, res: Response) => {
  const backOfficerId = req.params.backOfficerId;
  try {
    const getBackOfficerInfo = await dbBackOfficers.findOne({
      _id: backOfficerId,
    });

    if (!getBackOfficerInfo) {
      res.json(
        response.success({
          message: "No back officer found with the provided ID",
        }),
      );
    } else {
      const plainBackOfficerInfo = getBackOfficerInfo?.toObject();

      res.json(response.success({ item: plainBackOfficerInfo }));
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

export const getBackOfficerInfo = async (req: Request, res: Response) => {
  const backOfficerId = req.params.backOfficerId;
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;

  if (!isBackOfficer) {
    return res.json(
      response.error({
        message: NOT_AUTHORIZED,
      }),
    );
  }
  try {
    const getBackOfficerInfo = await dbBackOfficers
      .findOne({ _id: backOfficerId }, "-password")
      .populate({
        path: "profilePicture",
        select: "key",
      });
    if (!getBackOfficerInfo) {
      return res.json(
        response.error({
          message: BACKOFFICER_NOT_EXIST,
        }),
      );
    }

    res.json(
      response.success({
        item: getBackOfficerInfo,
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

export const updateBackOfficerPersonalInfo = async (
  req: Request,
  res: Response,
) => {
  const backOfficerId = req.params.backOfficerId;
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;

  const { firstName, lastName, username }: T_Update_Back_Officer_Personal_Info =
    req.body;

  if (!isBackOfficer) {
    return res.json(
      response.error({
        message: NOT_AUTHORIZED,
      }),
    );
  }

  try {
    const updatedBackOfficerPersonalInfo =
      await dbBackOfficers.findByIdAndUpdate(
        backOfficerId,
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

    if (!updatedBackOfficerPersonalInfo) {
      return res.json(
        response.error({
          message: BACKOFFICER_NOT_EXIST,
        }),
      );
    }

    res.json(
      response.success({
        item: updatedBackOfficerPersonalInfo,
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
