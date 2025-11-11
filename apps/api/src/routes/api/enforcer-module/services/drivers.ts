import { REQUIRED_VALUE_EMPTY } from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbDrivers from "@/models/dbDrivers";
import {
  E_Notification_Categories,
  T_Add_Driver,
  Z_Add_Driver,
} from "@repo/contract";
import { EncryptionService } from "@repo/services";
import { Request, Response } from "express";
import dbAddresses from "@/models/dbAddresses";
import dbNotifications from "@/models/dbNotifications";

const response = new ResponseService();
const passwordEncryption = new EncryptionService("password");

export const addDriver = async (req: Request, res: Response) => {
  const isInputValid = Z_Add_Driver.safeParse(req.body);
  if (isInputValid.success) {
    const {
      firstName,
      lastName,
      address,
      dateOfBirth,
      username,
    }: T_Add_Driver = req.body;
    try {
      const driver = await dbDrivers.findOne({
        username: username as string,
      });

      const password = "Driver@12345"; // Default password

      const encryptedPassword = passwordEncryption.encrypt(password);

      // OLD LOGIC FOR GENERATING CONTROL NUMBER
      // let driverControlNumber;
      // let isUnique = false;

      // // Ensure unique driverControlNumber
      // while (!isUnique) {
      //   driverControlNumber = `DCN-${generateDriverControlNumber(5)}`;
      //   const existingDriver = await dbDrivers.findOne({
      //     driverControlNumber,
      //   });

      //   if (!existingDriver) {
      //     isUnique = true;
      //   }
      // }

      const yearSuffix = new Date().getFullYear().toString().slice(-2); // e.g., "25"
      const userCount = await dbDrivers.countDocuments({});
      const paddedNumber = String(userCount + 1).padStart(3, "0"); // Adjust length as needed
      const driverControlNumber = `DCN-${paddedNumber}${yearSuffix}`;

      // Create new address document
      const newAddress = new dbAddresses(address);
      await newAddress.save();

      if (!driver) {
        const newDriver = new dbDrivers({
          driverControlNumber,
          firstName: firstName,
          lastName: lastName,
          address: newAddress._id,
          dateOfBirth,
          username: username,
          password: encryptedPassword,
        });
        await newDriver.save();

        await dbNotifications.create({
          driver: newDriver._id,
          category: E_Notification_Categories.WC,
          subject: `Welcome ${newDriver.username}`,
          content: `${newDriver.driverControlNumber}`,
        });

        res.json(
          response.success({
            item: newDriver,
            message: `New ${newDriver.role} created successfully!`,
          }),
        );
      } else {
        res.json(
          response.error({
            message: "Username already exists!",
          }),
        );
      }
    } catch (err: any) {
      res.json(
        response.error({
          message: err.message,
        }),
      );
    }
  } else {
    res.json(
      response.error({
        message: REQUIRED_VALUE_EMPTY,
      }),
    );
  }
};
