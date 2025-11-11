import { Request, Response } from "express";
import dbTickets from "@/models/dbTickets";
import dbReceipts from "@/models/dbReceipts";
import { ResponseService } from "@/common/services/response";
import convertNumberToWords from "../helpers/convertNumberToWords";
import {
  DRIVER_NOT_EXIST,
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import {
  E_Notification_Categories,
  E_Payment_Status,
  T_Receipt,
  Z_Photo,
} from "@repo/contract";
import dbNotifications from "@/models/dbNotifications";
import generateReceiptNumber from "../helpers/generateReceiptNumber";
import { FileService } from "@/common/services/file";
import dbPhotos from "@/models/dbPhotos";

const response = new ResponseService();
const fileService = new FileService();

export const addReceipt = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const treasurerId = res.locals.backOfficer?.id;
  const { ticketNumber, agency }: T_Receipt = req.body;

  if (!isBackOfficer && !treasurerId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    // Find the ticket by ticketNumber and populate necessary fields
    const ticket = await dbTickets
      .findOne({ ticketNumber })
      .populate({
        path: "violations",
        select: "violationId penaltyId",
        populate: [
          {
            path: "violationId",
            select: "violationDescription",
          },
          {
            path: "penaltyId",
            select: "penalty",
          },
        ],
      })
      .populate({
        path: "otherViolations",
        populate: [
          {
            path: "violationId",
            select: "violationDescription",
          },
          {
            path: "penaltyId",
            select: "penalty",
          },
        ],
      })
      .populate({
        path: "driver",
        select: "_id",
      });

    if (!ticket) {
      return res.json(
        response.error({
          message: "Ticket not found. Please provide a valid ticket number!",
        }),
      );
    }

    // Check if the ticket already has a receipt
    if (ticket.receipt) {
      return res.json(
        response.error({
          message: `Receipt for ticket ${ticketNumber} is already created!`,
        }),
      );
    }

    // Use the driver's ObjectId as the payor
    const payor = ticket.driver?._id;

    if (!payor) {
      return res.json(response.error({ message: DRIVER_NOT_EXIST }));
    }

    // Combine violations and otherViolations into a single array
    const allViolations = [
      ...ticket.violations.map((violation: any) => ({
        violationDescription: violation.violationId?.violationDescription,
        penalty: violation.penaltyId?.penalty || 0,
      })),
      ...ticket.otherViolations.map((otherViolation: any) => ({
        violationDescription: otherViolation.violationDescription,
        penalty: otherViolation.penaltyId?.penalty || 0,
      })),
    ];

    // Calculate the total amount
    const totalAmount = allViolations.reduce(
      (sum, violation) => sum + violation.penalty,
      0,
    );

    // Convert amount to words
    const amountInWords = convertNumberToWords(totalAmount);
    const receiptNumber = await generateReceiptNumber();

    // Create the receipt
    const newReceipt = await dbReceipts.create({
      receiptNumber,
      agency,
      collectingOfficer: treasurerId,
      payor,
      natureOfCollection: ticket._id,
      total: totalAmount,
      amountInWords,
    });

    // Update the ticket with the receipt reference
    ticket.receipt = newReceipt._id;
    ticket.paymentStatus = E_Payment_Status.Paid;
    ticket.updatedAt = new Date();
    await ticket.save();

    // Create notification for payment confirmation
    await dbNotifications.create({
      category: E_Notification_Categories.PC,
      driver: payor,
      ticket: ticket._id,
      subject: "Payment Confirmation: Ticket Successfully Paid",
    });

    // Return the created receipt
    res.json(
      response.success({
        item: newReceipt,
        message: `Receipt for Ticket #${ticketNumber} created successfully!`,
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

export const getAllReceipts = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const treasurerId = res.locals.backOfficer?.id;

  if (!isBackOfficer && !treasurerId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const receipts = await dbReceipts
      .find({ collectingOfficer: treasurerId })
      .populate({ path: "payor", select: "firstName lastName" });

    if (!receipts) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: receipts,
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

export const getReceptById = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const treasurerId = res.locals.backOfficer?.id;
  const receiptId = req.params.receiptId;

  if (!isBackOfficer && !treasurerId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const receipt = await dbReceipts
      .findOne({ _id: receiptId }) // Replace `receiptId` with the actual query
      .populate({ path: "payor", select: "firstName lastName" })
      .populate({ path: "collectingOfficer", select: "firstName lastName" })
      .populate({
        path: "natureOfCollection",
        select: "violations otherViolations",
        populate: [
          {
            path: "violations",
            select: "violationId penaltyId",
            populate: [
              {
                path: "violationId",
                select: "violationCategory violationDescription violationCode",
                populate: {
                  path: "violationCategory",
                  select: "violationCategoryName",
                },
              },
              {
                path: "penaltyId",
                select: "penaltyDescription penalty ",
              },
            ],
          },
          {
            path: "otherViolations",
            populate: [
              {
                path: "violationId",
                select: "violationCategory violationCode",
                populate: {
                  path: "violationCategory",
                  select: "violationCategoryName",
                },
              },
              {
                path: "penaltyId",
                select: "penaltyDescription penalty",
              },
            ],
          },
        ],
      });

    if (!receipt) {
      return res.json(
        response.error({
          message: RECORD_DOES_NOT_EXIST,
        }),
      );
    }

    res.json(
      response.success({
        item: receipt,
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

export const addTreasurerSignature = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const receiptId = req.params.receiptId;
  const files = req.files;
  const { description, tags, isMain } = req.body;
  const isValidInput = Z_Photo.safeParse(req.body);

  if (!isBackOfficer) {
    return res.json(
      response.error({
        message: NOT_AUTHORIZED,
      }),
    );
  }

  if (!files || !receiptId) {
    return res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
  }
  if (isValidInput.success) {
    try {
      const upload = await fileService.upload({ files });
      const values = {
        receiptId,
        key: upload.key,
        thumbKey: upload.key,
        description,
        tags,
        isMain,
      };
      const newPhoto = new dbPhotos(values);
      const uploadedPhoto = await newPhoto.save();
      const updatePhotos = await dbReceipts.findByIdAndUpdate(
        receiptId,
        {
          $push: {
            collectingOfficerSignature: uploadedPhoto._id,
          },
          $set: {
            updatedAt: new Date(),
          },
        },
        { new: true },
      );
      res.json(
        response.success({
          item: updatePhotos,
          message: "Photos was updated",
        }),
      );
    } catch (err: any) {
      return res.json(
        response.error({
          message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
        }),
      );
    }
  } else {
    return res.json(
      response.error({ message: JSON.parse(isValidInput.error.message) }),
    );
  }
};
