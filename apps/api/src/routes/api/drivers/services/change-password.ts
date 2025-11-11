import {
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
  DRIVER_NOT_EXIST,
  NOT_AUTHORIZED,
} from "@/common/constants";
import { PASSWORD_ENCRYPT_KEY } from "@/common/constants/ev";
import { ResponseService } from "@/common/services/response";
import dbDrivers from "@/models/dbDrivers";
import { T_Change_Password } from "@repo/contract";
import { Request, Response } from "express";
import CryptoJS from "crypto-js";

const response = new ResponseService();

export const updatePassword = async (req: Request, res: Response) => {
  const isDriver = res.locals.driver?.isDriver;
  const driverId = res.locals.driver?.id;
  if (!isDriver || !driverId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  const {
    currentPassword,
    newPassword,
    confirmNewPassword,
  }: T_Change_Password = req.body;
  try {
    const getDriver = await dbDrivers.findById(driverId);
    if (!getDriver) {
      res.json(response.error({ message: DRIVER_NOT_EXIST }));
    } else {
      if (!(currentPassword && newPassword && confirmNewPassword)) {
        res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
      } else {
        if (newPassword !== confirmNewPassword) {
          res.json(response.error({ message: "Password not matched!" }));
        } else {
          const decryptPassword = CryptoJS.AES.decrypt(
            getDriver?.password as string,
            PASSWORD_ENCRYPT_KEY,
          );
          const encryptCurrentPassword = CryptoJS.AES.encrypt(
            currentPassword,
            PASSWORD_ENCRYPT_KEY,
          );
          const decryptCurrentPassword = CryptoJS.AES.decrypt(
            encryptCurrentPassword.toString(),
            PASSWORD_ENCRYPT_KEY,
          );
          if (
            decryptCurrentPassword.toString() !== decryptPassword.toString()
          ) {
            res.json(response.error({ message: "Old password incorrect!" }));
          } else {
            const encryptNewPassword = CryptoJS.AES.encrypt(
              newPassword,
              PASSWORD_ENCRYPT_KEY,
            );
            const updatedDriverPassword = await dbDrivers.findByIdAndUpdate(
              driverId,
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
                item: updatedDriverPassword,
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
