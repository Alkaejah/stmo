import {
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
  DRIVER_NOT_EXIST,
  NOT_AUTHORIZED,
} from "@/common/constants";
import { BACKOFFICE_PASSWORD_ENCRYPT_KEY } from "@/common/constants/ev";
import { ResponseService } from "@/common/services/response";
import { T_Back_Officer_Change_Password } from "@repo/contract";
import { Request, Response } from "express";
import CryptoJS from "crypto-js";
import dbBackOfficers from "@/models/dbBackOfficers";

const response = new ResponseService();

export const updateBackOfficerPassword = async (
  req: Request,
  res: Response,
) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const backOfficerId = res.locals.backOfficer?.id;
  if (!isBackOfficer || !backOfficerId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  const {
    currentPassword,
    newPassword,
    confirmNewPassword,
  }: T_Back_Officer_Change_Password = req.body;
  try {
    const getBackOfficer = await dbBackOfficers.findById(backOfficerId);
    if (!getBackOfficer) {
      res.json(response.error({ message: DRIVER_NOT_EXIST }));
    } else {
      if (!(currentPassword && newPassword && confirmNewPassword)) {
        res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
      } else {
        if (newPassword !== confirmNewPassword) {
          res.json(response.error({ message: "Password not matched!" }));
        } else {
          const decryptPassword = CryptoJS.AES.decrypt(
            getBackOfficer?.password as string,
            BACKOFFICE_PASSWORD_ENCRYPT_KEY,
          );
          const encryptCurrentPassword = CryptoJS.AES.encrypt(
            currentPassword,
            BACKOFFICE_PASSWORD_ENCRYPT_KEY,
          );
          const decryptCurrentPassword = CryptoJS.AES.decrypt(
            encryptCurrentPassword.toString(),
            BACKOFFICE_PASSWORD_ENCRYPT_KEY,
          );
          if (
            decryptCurrentPassword.toString() !== decryptPassword.toString()
          ) {
            res.json(response.error({ message: "Old password incorrect!" }));
          } else {
            const encryptNewPassword = CryptoJS.AES.encrypt(
              newPassword,
              BACKOFFICE_PASSWORD_ENCRYPT_KEY,
            );
            const updatedBackOfficerPassword =
              await dbBackOfficers.findByIdAndUpdate(
                backOfficerId,
                {
                  $set: {
                    password: encryptNewPassword.toString(),
                    changePasswordAt: new Date(),
                  },
                },
                { new: true },
              );

            res.json(
              response.success({
                item: updatedBackOfficerPassword,
                // allItemCount: 1,
                message: "Password updated successfully!",
              }),
            );
          }
        }
      }
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED;
    res.json(response.error({ message: message }));
  }
};
