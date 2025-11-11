import {
  BACKOFFICER_NOT_EXIST,
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import { EncryptionService } from "@repo/services";
import { Request, Response } from "express";
import generateBackOfficeSession from "../helpers/generateBackOfficeSession";
import { BACKOFFICE_CSRF, BACKOFFICE_SESSION } from "@repo/constants";
import redisClient from "@/common/utils/redisClient";
import {
  T_Add_Back_Officers,
  T_Back_Officer_Forgot_Password,
  T_Back_Officer_Register,
  T_Back_Officer_Verify_Forgot_Password,
  T_Back_Officers,
  Z_Add_Back_Officers,
  Z_Back_Officer_Register,
} from "@repo/contract";
import dbBackOfficers from "@/models/dbBackOfficers";
import generateBackOfficerControlNumber from "../helpers/generateBackOfficerControlNumber";

const response = new ResponseService();
const passwordEncryption = new EncryptionService("backOfficePassword");
const decryptionService = new EncryptionService("backOfficePassword");
const encryptionService = new EncryptionService("backOfficePassword");

export const backOfficerInfo = async (req: Request, res: Response) => {
  res.json(
    response.success({
      item: res.locals.backOfficer,
    }),
  );
};

export const backOfficerVerifySession = async (req: Request, res: Response) => {
  res.json(
    response.success({
      item: res.locals.backOfficer,
    }),
  );
};

export const backOfficerRegister = async (req: Request, res: Response) => {
  const isInputValid = Z_Back_Officer_Register.safeParse(req.body);
  if (isInputValid.success) {
    const { username, password, role }: T_Back_Officer_Register = req.body;
    try {
      const backOfficer = await dbBackOfficers.findOne({
        username: username as string,
      });
      const encryptedPassword = passwordEncryption.encrypt(password);
      if (!backOfficer) {
        const newBackOfficer = new dbBackOfficers({
          username: username,
          password: encryptedPassword,
          role: role,
        });
        await newBackOfficer.save();

        await generateBackOfficeSession(
          req,
          res,
          newBackOfficer as unknown as T_Back_Officers,
        );

        res.json(
          response.success({
            action: {
              type: "REGISTER_LOGIN_SUCCESS",
              link: `/backoffice`,
            },
            message: "Back officer registered and login!",
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

export const backOfficerLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username && password) {
    try {
      const backOfficer = await dbBackOfficers.findOne({
        username: username,
      });

      if (!backOfficer) {
        throw new Error("Invalid username or password!");
      }

      const decryptedPassword = decryptionService.decrypt(
        backOfficer?.password as string,
      );

      const originalPassword = decryptedPassword.toString();
      const decryptInputPassword = passwordEncryption.decrypt(password);

      if (backOfficer && originalPassword === decryptInputPassword) {
        await generateBackOfficeSession(
          req,
          res,
          backOfficer as unknown as T_Back_Officers,
        );

        if (backOfficer.deactivated) {
          return res.json(
            response.error({
              message:
                "Your account has been Deactivated. Contact Administrator",
            }),
          );
        }
        // const params = `/?session.id=${backOfficer.id}`;
        res.json(
          response.success({
            action: {
              type: "MANUAL_LOGIN_SUCCESS",
              link: "/officer/dashboard", // Home
            },
            message: "Back officer logged in!",
          }),
        );
      } else {
        res.json(
          response.error({
            message: "Invalid username or password!",
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

export const backOfficerLogout = async (req: Request, res: Response) => {
  const backOfficeSessionCookie = req.cookies[BACKOFFICE_SESSION];
  const backOfficeCsrfCookie = req.cookies[BACKOFFICE_CSRF];

  if (backOfficeSessionCookie && backOfficeCsrfCookie) {
    try {
      const backOfficeSession = await redisClient.hGetAll(
        `${backOfficeSessionCookie}:${backOfficeCsrfCookie}`,
      );
      if (backOfficeSession) {
        await redisClient.del(
          `${backOfficeSessionCookie}:${backOfficeCsrfCookie}`,
        );
      }
      res.clearCookie(BACKOFFICE_SESSION);
      res.clearCookie(BACKOFFICE_CSRF);
      res.json(
        response.success({
          action: {
            type: "LOGOUT_SUCCESS",
            link: "/", // Home
          },
          message: "Back officer logged out!",
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
        message: "Back officer successfully logout!",
      }),
    );
  }
};

export const addBackOfficer = async (req: Request, res: Response) => {
  const isInputValid = Z_Add_Back_Officers.safeParse(req.body);
  if (!isInputValid.success) {
    return res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
  }

  const {
    firstName,
    lastName,
    username,
    role,
    assignment,
  }: T_Add_Back_Officers = req.body;

  if (!role) {
    return res.json(response.error({ message: "Role is required." }));
  }

  try {
    const existingUser = await dbBackOfficers.findOne({ username });
    if (existingUser) {
      return res.json(response.error({ message: "Username already exists!" }));
    }

    const password = "Officer@12345";
    const encryptedPassword = passwordEncryption.encrypt(password);

    let backOfficerControlNumber = await generateBackOfficerControlNumber(role);

    // Ensure unique control number
    let isUnique = false;
    while (!isUnique) {
      const existingControlNumber = await dbBackOfficers.findOne({
        backOfficerControlNumber,
      });

      if (!existingControlNumber) {
        isUnique = true;
      } else {
        backOfficerControlNumber = await generateBackOfficerControlNumber(role);
      }
    }

    const newBackOfficer = new dbBackOfficers({
      backOfficerControlNumber,
      firstName,
      lastName,
      username,
      password: encryptedPassword,
      role,
      assignment,
    });

    await newBackOfficer.save();

    res.json(
      response.success({
        item: newBackOfficer,
        message: `New ${newBackOfficer.role} created successfully!`,
      }),
    );
  } catch (err: any) {
    res.json(
      response.error({
        message: err.message || UNKNOWN_ERROR_OCCURRED,
      }),
    );
  }
};

export const backOfficerForgotVerify = async (req: Request, res: Response) => {
  const {
    backOfficerControlNumber,
    newPassword,
  }: T_Back_Officer_Verify_Forgot_Password = req.body;
  try {
    // Find the driver by backOfficerControlNumber
    const backOfficer = await dbBackOfficers.findOne({
      backOfficerControlNumber,
    });

    if (!backOfficer) {
      return res.json(response.error({ message: BACKOFFICER_NOT_EXIST }));
    }

    // Encrypt the new password
    const decryptNewPassword = decryptionService.decrypt(newPassword);
    const encryptPassword = encryptionService.encrypt(decryptNewPassword);

    // Update the officers's password
    const updatedBackOfficer = await dbBackOfficers.findOneAndUpdate(
      { backOfficerControlNumber },
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

export const backOfficerForgot = async (req: Request, res: Response) => {
  const { backOfficerControlNumber }: T_Back_Officer_Forgot_Password = req.body;

  // Validate required fields
  if (!backOfficerControlNumber) {
    return res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
  }

  try {
    // Check if the backOfficerControlNumber exists
    const backOfficer = await dbBackOfficers.findOne({
      backOfficerControlNumber,
    });

    if (!backOfficer) {
      return res.json(response.error({ message: BACKOFFICER_NOT_EXIST }));
    }

    // Respond with a success message
    res.json(
      response.success({
        message: "Officer Control Number Verified!",
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
