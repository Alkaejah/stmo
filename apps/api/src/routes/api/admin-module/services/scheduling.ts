import { NOT_AUTHORIZED, UNKNOWN_ERROR_OCCURRED } from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbBackOfficers from "@/models/dbBackOfficers";
import {
  E_Back_Officer_Role,
  T_Update_Enforcer_Schedule_Time,
} from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();

export const getAllEnforcerForScheduling = async (
  req: Request,
  res: Response,
) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const enforcers = await dbBackOfficers
      .find(
        {
          role: E_Back_Officer_Role.Enforcer,
        },
        "-backOfficerControlNumber -profilePicture -username -password -feedbacks",
      )
      .populate({
        path: "assignment",
        select: "street.street barangay.barangay",
      });

    if (!enforcers) {
      return res.json(
        response.error({
          message: "No enforcer found!",
        }),
      );
    }

    res.json(
      response.success({
        items: enforcers,
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

export const updateScheduleTime = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  const enforcerId = req.params.enforcerId;
  const { scheduleTime }: T_Update_Enforcer_Schedule_Time = req.body;
  try {
    const enforcer = await dbBackOfficers.findByIdAndUpdate(
      enforcerId,
      {
        scheduleTime,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!enforcer) {
      return res.json(response.error({ message: "Enforcer not found." }));
    }

    return res.json(
      response.success({
        item: enforcer,
        message: "Schedule time successfully updated!",
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
