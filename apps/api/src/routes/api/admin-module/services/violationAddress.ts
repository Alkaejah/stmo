import {
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbViolationAddress from "@/models/dbViolationAddress";
import { T_Violation_Address } from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();

export const addViolationAddress = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const { street, barangay }: T_Violation_Address = req.body;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const newViolationAddress = await dbViolationAddress.create({
      street,
      barangay,
    });

    const saveNewViolationAddress = await newViolationAddress.save();

    res.json(
      response.success({
        item: saveNewViolationAddress,
        message: "New violation address created successfully!",
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

export const getAllViolationAddress = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const violationAddresses = await dbViolationAddress.find({});
    if (!violationAddresses) {
      return res.json(
        response.error({
          message: NO_RECORD_FOUND,
        }),
      );
    }
    res.json(
      response.success({
        items: violationAddresses,
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

export const getViolationAddressById = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const violationAddressId = req.params.violationAddressId;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const violationAddress =
      await dbViolationAddress.findById(violationAddressId);
    if (!violationAddress) {
      return res.json(
        response.error({
          message: RECORD_DOES_NOT_EXIST,
        }),
      );
    }
    res.json(
      response.success({
        item: violationAddress,
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
