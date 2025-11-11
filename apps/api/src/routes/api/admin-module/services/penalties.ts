import {
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbPenalties from "@/models/dbPenalties";
import { T_Penalty, T_Update_Penalty } from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();

export const addPenalty = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const { penaltyDescription, penalty }: T_Penalty = req.body;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const newPenalty = await dbPenalties.create({
      penaltyDescription,
      penalty,
    });

    const savedPenalty = newPenalty.save();
    res.json(
      response.success({
        item: savedPenalty,
        message: "New penalty created successfully!",
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

export const getAllPenalties = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const penalties = await dbPenalties.find();

    if (!penalties) {
      return res.json(
        response.error({
          message: NO_RECORD_FOUND,
        }),
      );
    }

    res.json(
      response.success({
        items: penalties,
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

export const updatePenaltyById = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const penaltyId = req.params.penaltyId;
  const { penaltyDescription, penalty }: T_Update_Penalty = req.body;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const updatedPenalty = await dbPenalties.findOneAndReplace(
      { _id: penaltyId },
      {
        $set: {
          penaltyDescription: penaltyDescription,
          penalty: penalty,
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updatedPenalty) {
      return res.json(
        response.error({
          message: RECORD_DOES_NOT_EXIST,
        }),
      );
    }

    res.json(
      response.success({
        item: updatedPenalty,
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
