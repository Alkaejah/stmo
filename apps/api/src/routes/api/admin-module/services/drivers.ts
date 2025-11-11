import { FileService, T_UploadFileParams } from "@/common/services/file";
import { ResponseService } from "@/common/services/response";
import { Request, Response } from "express";
import { Readable } from "stream";
import csv from "csv-parser";
import dbDrivers from "@/models/dbDrivers";
import dbAddresses from "@/models/dbAddresses";
import { EncryptionService } from "@repo/services";
import {
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import dbNotifications from "@/models/dbNotifications";
import { E_Notification_Categories } from "@repo/contract";

const response = new ResponseService();
const fileService = new FileService();
const passwordEncryption = new EncryptionService("password");

export const uploadDriversCSV = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const file = req.files?.file;
    if (!file) {
      return res.json(response.error({ message: "No file uploaded!" }));
    }

    const uploadedFile = Array.isArray(file) ? file[0] : file;
    if (uploadedFile?.mimetype !== "text/csv") {
      return res.json(response.error({ message: "Unsupported file format!" }));
    }

    const uploadParams: T_UploadFileParams = { files: { file } };
    const uploadResult = await fileService.upload(uploadParams);
    const s3Key = uploadResult.key;

    const fileBuffer = await fileService.get({ key: s3Key });

    const driversData: any[] = [];
    const duplicateUsernames: string[] = [];

    const readable = new Readable();
    readable._read = () => {};
    readable.push(fileBuffer);
    readable.push(null);

    readable
      .pipe(csv())
      .on("data", (row) => {
        const { firstName, lastName, username, dateOfBirth } = row;
        const address = {
          street: row["address.street"] || "",
          barangay: row["address.barangay"] || "",
          municipality: row["address.municipality"] || "",
          province: row["address.province"] || "",
        };

        if (!username) return;

        driversData.push({
          firstName,
          lastName,
          address,
          dateOfBirth,
          username,
        });
      })
      .on("end", async () => {
        const usernames = driversData.map((driver) => driver.username);
        const existingDrivers = await dbDrivers.find({
          username: { $in: usernames },
        });
        const existingUsernames = new Set(
          existingDrivers.map((driver) => driver.username),
        );

        const filteredDriversData = driversData.filter((driver) => {
          if (existingUsernames.has(driver.username)) {
            duplicateUsernames.push(driver.username);
            return false;
          }
          return true;
        });

        if (filteredDriversData.length === 0) {
          return res.json(
            response.error({ message: "No valid drivers to save!" }),
          );
        }

        try {
          const yearSuffix = new Date().getFullYear().toString().slice(-2); // e.g., "25"
          const currentCount = await dbDrivers.countDocuments(); // Starting count
          const savedDrivers = [];

          for (let i = 0; i < filteredDriversData.length; i++) {
            const driver = filteredDriversData[i];
            const paddedNumber = String(currentCount + i + 1).padStart(3, "0"); // e.g., "001"
            const driverControlNumber = `DCN-${paddedNumber}${yearSuffix}`; // e.g., DCN-00125

            const newAddress = await dbAddresses.create(driver.address);
            const encryptedPassword =
              passwordEncryption.encrypt("Driver@12345");

            const newDriver = new dbDrivers({
              driverControlNumber,
              firstName: driver.firstName,
              lastName: driver.lastName,
              address: newAddress._id,
              dateOfBirth: driver.dateOfBirth,
              username: driver.username,
              password: encryptedPassword,
            });

            await newDriver.save();

            await dbNotifications.create({
              driver: newDriver._id,
              category: E_Notification_Categories.WC,
              subject: `Welcome ${newDriver.username}`,
              content: `${newDriver.driverControlNumber}`,
            });

            savedDrivers.push(newDriver);
          }

          res.json(
            response.success({
              items: savedDrivers,
              extendedItem: [...new Set(duplicateUsernames)],
              message:
                "Drivers successfully uploaded and saved, excluding duplicates!",
            }),
          );
        } catch (err: any) {
          return res.json(
            response.error({
              message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
            }),
          );
        }
      })
      .on("error", (err) => {
        return res.json(response.error({ message: "Error parsing CSV file" }));
      });
  } catch (err: any) {
    return res.json(
      response.error({
        message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
      }),
    );
  }
};

export const getAllDrivers = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const drivers = await dbDrivers.find();

    if (!drivers) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: drivers,
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

export const getDriverById = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const driverId = req.params.driverId;

  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const driver = await dbDrivers
      .findOne({ _id: driverId }, "-password -__v")
      .populate({ path: "address", select: "-createdAt -__v" });

    if (!driver) {
      return res.json(response.error({ message: RECORD_DOES_NOT_EXIST }));
    }

    res.json(
      response.success({
        item: driver,
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
