import {
  CSRF,
  DRIVER_NOT_EXIST,
  REQUIRED_VALUE_EMPTY,
  SESSION,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import {
  E_Notification_Categories,
  T_Driver_Register,
  T_Drivers,
  T_Forgot_Password,
  T_Verify_Forgot_Password,
  Z_Driver_Register,
} from "@repo/contract";
import { EncryptionService } from "@repo/services";
import { Request, Response } from "express";
import generateSession from "../helpers/generateSession";
import redisClient from "@/common/utils/redisClient";
import dbDrivers from "@/models/dbDrivers";
import generateRandomCode from "../helpers/generateControlNumber";
import dbAddresses from "@/models/dbAddresses";
import dbNotifications from "@/models/dbNotifications";

const response = new ResponseService();
const passwordEncryption = new EncryptionService("password");
const encryptionService = new EncryptionService("password");
const decryptionService = new EncryptionService("password");

export const register = async (req: Request, res: Response) => {
  const isInputValid = Z_Driver_Register.safeParse(req.body);
  if (!isInputValid.success) {
    return res.json(
      response.error({
        message: REQUIRED_VALUE_EMPTY,
      }),
    );
  }

  const {
    firstName,
    lastName,
    username,
    password,
    isVerified,
    address,
    dateOfBirth,
  }: T_Driver_Register = req.body;

  try {
    const encryptedPassword = passwordEncryption.encrypt(password);

    let driverControlNumber;
    let isUnique = false;

    // Ensure unique driverControlNumber
    while (!isUnique) {
      driverControlNumber = `DCN-${generateRandomCode(12)}`;
      const existingDriver = await dbDrivers.findOne({
        driverControlNumber,
      });

      if (!existingDriver) {
        isUnique = true;
      }
    }

    // Create new address document
    const newAddress = new dbAddresses(address);
    await newAddress.save();

    // Create new driver document with address reference
    const newDriver = new dbDrivers({
      driverControlNumber,
      firstName,
      lastName,
      username,
      password: encryptedPassword,
      isVerified,
      address: newAddress._id, // Store ObjectId reference
      dateOfBirth,
    });

    await newDriver.save();

    await dbNotifications.create({
      category: E_Notification_Categories.WC,
      subject: `Welcome ${newDriver.username}`,
      content: `${newDriver.driverControlNumber}`,
    });

    await generateSession(req, res, newDriver as unknown as T_Drivers);
    const params = `/?session.id=${newDriver.id}`;
    res.json(
      response.success({
        action: {
          type: "REGISTER_LOGIN_SUCCESS",
          link: `/driver/dashboard${params}`,
        },
        message: "Driver registered and logged in",
      }),
    );
  } catch (err: any) {
    res.json(
      response.error({
        message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
      }),
    );
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username && password) {
    try {
      const driver = await dbDrivers.findOne({
        username: username,
      });

      if (!driver) {
        return res.json(
          response.error({
            message: "Incorrect username or password!",
          }),
        );
      }

      const decryptedPassword = passwordEncryption.decrypt(
        driver?.password as string,
      );

      const originalPassword = decryptedPassword.toString();
      const decryptInputPassword = passwordEncryption.decrypt(password);

      if (driver && originalPassword === decryptInputPassword) {
        await generateSession(req, res, driver as unknown as T_Drivers);

        if (driver.deactivated) {
          return res.json(
            response.error({
              message:
                "Your account has been Deactivated. Contact Administrator",
            }),
          );
        }

        const params = `/?session.id=${driver.id}`;
        res.json(
          response.success({
            action: {
              type: "MANUAL_LOGIN_SUCCESS",
              link: `/driver/dashboard${params}`,
            },
            message: "Driver successfully logged in",
          }),
        );
      } else {
        res.json(
          response.error({
            message: "Incorrect username or password!",
          }),
        );
      }
    } catch (err: any) {
      res.json(
        response.error({
          message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
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

export const logout = async (req: Request, res: Response) => {
  const sessionCookie = req.cookies[SESSION];
  const csrfCookie = req.cookies[CSRF];

  if (sessionCookie && csrfCookie) {
    try {
      const session = await redisClient.hGetAll(`
        ${sessionCookie}:${csrfCookie}`);
      if (session) {
        await redisClient.del(`${sessionCookie}:${csrfCookie}`);
      }
      // res.clearCookie(SESSION);
      // res.clearCookie(CSRF);
      res.clearCookie(SESSION, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // Use lowercase "none"
      });
      res.clearCookie(CSRF, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // Use lowercase "none"
      });

      res.json(
        response.success({
          action: {
            type: "LOGOUT_SUCCESS",
            link: "/", // Home
          },
          message: "User logged out!",
        }),
      );
    } catch (err: any) {
      res.json(
        response.error({
          message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
        }),
      );
    }
  } else {
    res.json(
      response.success({
        message: "Success logout!",
      }),
    );
  }
};

export const forgotVerify = async (req: Request, res: Response) => {
  const { driverControlNumber, newPassword }: T_Verify_Forgot_Password =
    req.body;
  try {
    // Find the driver by driverControlNumber
    const driver = await dbDrivers.findOne({ driverControlNumber });

    if (!driver) {
      return res.json(response.error({ message: DRIVER_NOT_EXIST }));
    }

    // Encrypt the new password
    const decryptNewPassword = decryptionService.decrypt(newPassword);
    const encryptPassword = encryptionService.encrypt(decryptNewPassword);

    // Update the driver's password
    const updatedDriver = await dbDrivers.findOneAndUpdate(
      { driverControlNumber },
      {
        $set: {
          password: String(encryptPassword),
        },
      },
      { new: true },
    );

    // Respond with success
    res.json(
      response.success({
        message: "Password successfully updated!",
      }),
    );
  } catch (err: any) {
    res.json(
      response.error({
        message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
      }),
    );
  }
};

export const forgot = async (req: Request, res: Response) => {
  const { driverControlNumber }: T_Forgot_Password = req.body;

  // Validate required fields
  if (!driverControlNumber) {
    return res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
  }

  try {
    // Check if the driverControlNumber exists
    const driver = await dbDrivers.findOne({ driverControlNumber });

    if (!driver) {
      return res.json(response.error({ message: DRIVER_NOT_EXIST }));
    }

    // Respond with a success message
    res.json(
      response.success({
        message: "Driver Control Number Verified!",
      }),
    );
  } catch (err: any) {
    res.json(
      response.error({
        message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
      }),
    );
  }
};

export const info = async (req: Request, res: Response) => {
  res.json(
    response.success({
      item: res.locals.driver,
    }),
  );
};

export const verifySession = async (req: Request, res: Response) => {
  res.json(
    response.success({
      item: res.locals.driver,
    }),
  );
};
