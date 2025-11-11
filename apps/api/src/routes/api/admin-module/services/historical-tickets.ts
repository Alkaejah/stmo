import {
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { FileService, T_UploadFileParams } from "@/common/services/file";
import { ResponseService } from "@/common/services/response";
import dbHistoricalTickets from "@/models/dbHistoricalTickets";
import { T_Historical_Ticket } from "@repo/contract";
import { Request, Response } from "express";
import { Readable } from "stream";
import csv from "csv-parser";

const response = new ResponseService();
const fileService = new FileService();

export const uploadHistoricalTicketsCSV = async (
  req: Request,
  res: Response,
) => {
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

    const historicalTickets: any[] = [];
    const readable = new Readable();
    readable._read = () => {};
    readable.push(fileBuffer);
    readable.push(null);

    readable
      .pipe(csv({ mapHeaders: ({ header }) => header.trim() })) // Trim headers
      .on("data", (row) => {
        const dateStr = row["date"] ? String(row["date"]).trim() : "";
        const timeStr = row["time"] ? String(row["time"]).trim() : "";

        let finalCreatedAt = null;

        if (dateStr && timeStr) {
          const dateParts = dateStr.split("/");
          const timeParts = timeStr.split(" ");

          if (dateParts.length === 3 && timeParts.length === 2) {
            const [month, day, year] = dateParts.map((part) =>
              part.padStart(2, "0"),
            );
            const [time, period] = timeParts;
            const timeSplit = time ? time.split(":") : [];

            let formattedHours = 0;
            let minutes = "00";

            if (timeSplit.length === 2) {
              formattedHours = parseInt(timeSplit[0] || "0", 10);
              minutes = timeSplit[1] || "00";
            }

            if (period?.toUpperCase() === "PM" && formattedHours !== 12) {
              formattedHours += 12;
            } else if (
              period?.toUpperCase() === "AM" &&
              formattedHours === 12
            ) {
              formattedHours = 0;
            }

            const formattedDateString = `${year}-${month}-${day}T${formattedHours.toString().padStart(2, "0")}:${minutes.padStart(2, "0")}:00.000Z`;
            finalCreatedAt = new Date(formattedDateString); // Convert to Date object
          } else {
            console.warn(
              `Skipping row with invalid date or time format: ${dateStr}, ${timeStr}`,
            );
            return; // Skip this row and continue processing the next one
          }
        } else {
          console.warn(
            `Skipping row with missing date or time: ${dateStr}, ${timeStr}`,
          );
          return; // Skip this row and continue processing the next one
        }

        if (!finalCreatedAt || isNaN(finalCreatedAt.getTime())) {
          console.warn(
            `Skipping row with invalid date or time format or missing fields: ${dateStr}, ${timeStr}`,
          );
          return; // Skip this row and continue processing the next one
        }

        historicalTickets.push({
          violatorAddress: {
            municipality: row.violatorAddressMunicipality,
            cityProvince: row.violatorAddressCityProvince,
          },
          violationAddress: {
            street: row.violationStreet,
            barangay: row.violationBarangay,
            longitude: parseFloat(row.longitude) || 0,
            latitude: parseFloat(row.latitude) || 0,
          },
          violationCode: row.violationCode,
          violationDescription: row.violationDescription,
          offense: row.offense,
          createdAt: finalCreatedAt, // This is now a Date object
        });
      })
      .on("end", async () => {
        try {
          const savedHistoricalTickets =
            await dbHistoricalTickets.insertMany(historicalTickets);
          res.json(
            response.success({
              items: savedHistoricalTickets,
              message: "Historical tickets successfully uploaded and saved!",
            }),
          );
        } catch (err: any) {
          return res.json(
            response.error({ message: err.message || UNKNOWN_ERROR_OCCURRED }),
          );
        }
      });
  } catch (err: any) {
    return res.json(
      response.error({ message: err.message || UNKNOWN_ERROR_OCCURRED }),
    );
  }
};

export const addHistoricalTicket = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  const {
    violatorAddress,
    violationAddress,
    violationCode,
    violationDescription,
    penalty,
    createdAt,
  }: T_Historical_Ticket = req.body;
  try {
    const newHistoricalTicket = new dbHistoricalTickets({
      violatorAddress,
      violationAddress,
      violationCode,
      violationDescription,
      penalty,
      createdAt,
    });

    const savedHistoricalTicket = await newHistoricalTicket.save();

    res.json(
      response.success({
        item: savedHistoricalTicket,
        message: "New historical ticket created successfully!",
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

export const getAllHistoricalTickets = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const historicalTickets = await dbHistoricalTickets.find();

    if (!historicalTickets) {
      return res.json(
        response.error({
          message: NO_RECORD_FOUND,
        }),
      );
    }

    res.json(
      response.success({
        items: historicalTickets,
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

export const getHistoricalTicketById = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  const historicalTicketId = req.params.historicalTicketId;
  try {
    const historicalTicket = await dbHistoricalTickets.findOne({
      _id: historicalTicketId,
    });

    if (!historicalTicket) {
      return res.json(
        response.error({
          message: RECORD_DOES_NOT_EXIST,
        }),
      );
    }

    res.json(
      response.success({
        item: historicalTicket,
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
