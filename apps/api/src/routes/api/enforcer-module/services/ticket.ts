import {
  DRIVER_NOT_EXIST,
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbDrivers from "@/models/dbDrivers";
import dbTickets from "@/models/dbTickets";
import {
  E_Back_Officer_Role,
  E_Notification_Categories,
  T_Ticket,
  Z_Photo,
} from "@repo/contract";
import { Request, Response } from "express";
import mongoose from "mongoose";
import generateTicketNumber from "../helpers/generateTicketNumber";
import dbViolations from "@/models/dbViolations";
import dbNotifications from "@/models/dbNotifications";
import { FileService } from "@/common/services/file";
import dbPhotos from "@/models/dbPhotos";
import dbBackOfficers from "@/models/dbBackOfficers";
import dbPenalties from "@/models/dbPenalties";
import dbReceipts from "@/models/dbReceipts";

const response = new ResponseService();
const fileService = new FileService();

//TODO: Add a logic to auto generate ticket number
//TODO: Add a logic or condition check if the violation count of the driver reaches the worst violation

export const addTicket = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const enforcerId = res.locals.backOfficer?.id;

  const {
    licenseNumber,
    plateNumber,
    violations,
    driverControlNumber,
  }: T_Ticket = req.body;

  if (!isBackOfficer || !enforcerId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const enforcer = await dbBackOfficers.findById(enforcerId);
    if (!enforcer || enforcer.role !== E_Back_Officer_Role.Enforcer) {
      return res.json(response.error({ message: NOT_AUTHORIZED }));
    }

    const driver = await dbDrivers.findOne({ driverControlNumber });
    if (!driver) {
      return res.json(response.error({ message: DRIVER_NOT_EXIST }));
    }

    const ticketNumber = await generateTicketNumber();

    const otherViolations: {
      violationId: mongoose.Types.ObjectId;
      violationDescription: string;
      penaltyId: mongoose.Types.ObjectId;
    }[] = [];

    const violationIds: {
      violationId: mongoose.Types.ObjectId;
      penaltyId: mongoose.Types.ObjectId;
    }[] = [];

    const penaltyProgression = [
      "Pangkaraniwang paglabag sa trapiko",
      "Unang Paglabag",
      "Pangalawang Paglabag",
      "Ikatlong Paglabag",
      "Tahasang paglabag sa lahat ng umiiral na Kautusang Bayan batay sa Una, Pangalawa at Pangatlong Paglabag",
    ];

    await Promise.all(
      violations.map(async (violation: any) => {
        if (violation.code === "31") {
          const violationRecord = await dbViolations.findOne({
            violationCode: "31",
          });

          if (!violationRecord) {
            return res.json(
              response.error({
                message: "Violation with code '31' not found.",
              }),
            );
          }

          otherViolations.push({
            violationId: violationRecord._id,
            violationDescription: violation.description,
            penaltyId: new mongoose.Types.ObjectId(violation.penaltyId),
          });
        } else {
          const violationId = new mongoose.Types.ObjectId(
            violation.violationId,
          );

          const repeatCount = await dbTickets.countDocuments({
            driver: driver._id,
            $or: [
              { "violations.violationId": violationId },
              { "otherViolations.violationId": violationId },
            ],
          });

          const penaltyDescription =
            penaltyProgression[Math.min(repeatCount, 4)];

          const penaltyDoc = await dbPenalties.findOne({
            penaltyDescription,
          });

          if (!penaltyDoc) {
            throw new Error(`Penalty not found for: ${penaltyDescription}`);
          }

          violationIds.push({
            violationId,
            penaltyId: penaltyDoc._id,
          });
        }
      }),
    );

    const enforcerCurrentAssignment =
      enforcer.assignment && enforcer.assignment.length > 0
        ? enforcer.assignment[enforcer.assignment.length - 1]
        : null;

    if (!enforcerCurrentAssignment) {
      return res.json(
        response.error({ message: "Enforcer has no current assignment." }),
      );
    }

    const newTicket = await dbTickets.create({
      ticketNumber,
      licenseNumber,
      plateNumber,
      driver: driver._id,
      enforcer: enforcerId,
      violations: violationIds,
      otherViolations,
      address: enforcerCurrentAssignment, // ✅ use current assignment only
    });

    await dbDrivers.findByIdAndUpdate(driver._id, {
      $inc: { violationCount: 1 },
    });

    await dbNotifications.create({
      category: E_Notification_Categories.AR,
      driver: driver._id,
      ticket: newTicket._id,
      subject: "Action Required: Confirm Your Ticket Violation",
    });

    res.json(
      response.success({
        item: newTicket,
        message: `Ticket #${ticketNumber} created successfully!`,
      }),
    );
  } catch (err: any) {
    return res.json(
      response.error({ message: err.message || UNKNOWN_ERROR_OCCURRED }),
    );
  }
};

// export const addTicket = async (req: Request, res: Response) => {
//   const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
//   const enforcerId = res.locals.backOfficer?.id;

//   const {
//     licenseNumber,
//     plateNumber,
//     violations,
//     driverControlNumber,
//   }: T_Ticket = req.body;

//   if (!isBackOfficer && !enforcerId) {
//     return res.json(response.error({ message: NOT_AUTHORIZED }));
//   }

//   try {
//     const enforcer = await dbBackOfficers.findById(enforcerId);
//     if (!enforcer || enforcer.role !== E_Back_Officer_Role.Enforcer) {
//       return res.json(response.error({ message: NOT_AUTHORIZED }));
//     }

//     const driver = await dbDrivers.findOne({ driverControlNumber });

//     if (!driver) {
//       return res.json(response.error({ message: DRIVER_NOT_EXIST }));
//     }

//     const ticketNumber = await generateTicketNumber();

//     // Declare arrays to store violations and otherViolations separately
//     const otherViolations: {
//       violationId: mongoose.Types.ObjectId;
//       violationDescription: string;
//       penaltyId: mongoose.Types.ObjectId;
//     }[] = [];

//     const violationIds: {
//       violationId: mongoose.Types.ObjectId;
//       penaltyId: mongoose.Types.ObjectId;
//     }[] = [];

//     // Step 3: Process violations and separate "Other Violations"
//     await Promise.all(
//       violations.map(async (violation: any) => {
//         if (violation.code === "31") {
//           // Handle "Other Violation"
//           const violationRecord = await dbViolations.findOne({
//             violationCode: "31",
//           });

//           if (!violationRecord) {
//             return res.json(
//               response.error({
//                 message: "Violation with code '31' not found.",
//               }),
//             );
//           }

//           // Add to otherViolations with proper ObjectId assignment
//           otherViolations.push({
//             violationId: violationRecord._id, // Store actual violationId
//             violationDescription: violation.description,
//             penaltyId: new mongoose.Types.ObjectId(violation.penaltyId),
//           });
//         } else {
//           // Add pre-existing violations to violationIds
//           violationIds.push({
//             violationId: new mongoose.Types.ObjectId(violation.violationId),
//             penaltyId: new mongoose.Types.ObjectId(violation.penaltyId),
//           });
//         }
//       }),
//     );

//     const newTicket = await dbTickets.create({
//       ticketNumber,
//       licenseNumber,
//       plateNumber,
//       driver: driver._id,
//       enforcer: enforcerId,
//       violations: violationIds, // Store violations with penaltyId
//       otherViolations, // Store "Other Violations" separately
//       address: enforcer.assignment,
//     });

//     await dbDrivers.findByIdAndUpdate(driver._id, {
//       $inc: { violationCount: 1 },
//     });

//     // Create a notification for the driver
//     await dbNotifications.create({
//       category: E_Notification_Categories.AR,
//       driver: driver._id,
//       ticket: newTicket._id,
//       subject: "Action Required: Confirm Your Ticket Violation",
//     });

//     res.json(
//       response.success({
//         item: newTicket,
//         message: `Ticket #${ticketNumber} created successfully!`,
//       }),
//     );
//   } catch (err: any) {
//     return res.json(
//       response.error({
//         message: err.message || UNKNOWN_ERROR_OCCURRED,
//       }),
//     );
//   }
// };

export const checkViolationCount = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const enforcerId = res.locals.backOfficer?.id;

  if (!isBackOfficer || !enforcerId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const { driverControlNumber, violationId } = req.body;

    if (!driverControlNumber || !violationId) {
      return res.json(
        response.error({ message: "Required values are missing." }),
      );
    }

    const driver = await dbDrivers.findOne({ driverControlNumber });
    if (!driver) {
      return res.json(response.error({ message: DRIVER_NOT_EXIST }));
    }

    const repeatCount = await dbTickets.countDocuments({
      driver: driver._id,
      $or: [
        { "violations.violationId": violationId },
        { "otherViolations.violationId": violationId },
      ],
    });

    const penaltyProgression = [
      "Pangkaraniwang paglabag sa trapiko",
      "Unang Paglabag",
      "Pangalawang Paglabag",
      "Ikatlong Paglabag",
      "Tahasang paglabag sa lahat ng umiiral na Kautusang Bayan batay sa Una, Pangalawa at Pangatlong Paglabag",
    ];

    const penaltyDescription = penaltyProgression[Math.min(repeatCount, 4)];

    const penalty = await dbPenalties.findOne({ penaltyDescription });

    const penaltyId = penalty ? penalty._id.toString() : null;

    return res.json(
      response.success({
        extendedItem: {
          repeatCount,
          penaltyId,
        },
      }),
    );
  } catch (err: any) {
    return res.json(
      response.error({
        message: err.message || UNKNOWN_ERROR_OCCURRED,
      }),
    );
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  // const enforcerId = res.locals.backOfficer?.id;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const tickets = await dbTickets
      .find(
        {},
        "ticketNumber createdAt licenseNumber plateNumber paymentStatus ticketStatus",
      )
      .populate({ path: "receipt" })
      .populate({ path: "driver", select: "firstName lastName" });

    if (!tickets) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: tickets,
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

export const getTicketById = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  // const enforcerId = res.locals.backOfficer?.id;
  const ticketId = req.params.ticketId;

  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    const ticket = await dbTickets
      .findOne({ _id: ticketId })
      .populate({
        path: "driver",
        select: "firstName lastName address dateOfBirth violationCount role",
        populate: {
          path: "address",
          select: "street barangay municipality province",
        },
      })
      .populate({ path: "proof", select: "key" })
      .populate({ path: "enforcerSignature", select: "key" })
      .populate({
        path: "enforcer",
        select: "firstName lastName",
      })
      .populate({
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
            select: "penaltyDescription penalty",
          },
        ],
      })
      .populate({
        path: "otherViolations.violationId",
        select: "violationCategory violationCode",
        populate: {
          path: "violationCategory",
          select: "violationCategoryName",
        },
      })
      .populate({
        path: "otherViolations.penaltyId",
        select: "penaltyDescription penalty",
      })
      .populate({
        path: "address",
        select: "street barangay",
      });

    if (!ticket) {
      return res.json(response.error({ message: RECORD_DOES_NOT_EXIST }));
    }

    res.json(
      response.success({
        item: ticket,
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

//TODO: For Verification
export const getTicketsPerDay = async (req: Request, res: Response) => {
  try {
    const ticketsPerDay = await dbTickets.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.json(
      response.success({
        items: ticketsPerDay,
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

export const addProofOfViolation = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const ticketId = req.params.ticketId;
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

  if (!files || !ticketId) {
    return res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
  }
  if (isValidInput.success) {
    try {
      const upload = await fileService.upload({ files });
      const values = {
        ticketId,
        key: upload.key,
        thumbKey: upload.key,
        description,
        tags,
        isMain,
      };
      const newPhoto = new dbPhotos(values);
      const uploadedPhoto = await newPhoto.save();
      const updatePhotos = await dbTickets.findByIdAndUpdate(
        ticketId,
        {
          $push: {
            proof: uploadedPhoto._id,
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

export const addEnforcerSignature = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const ticketId = req.params.ticketId;
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

  if (!files || !ticketId) {
    return res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
  }
  if (isValidInput.success) {
    try {
      const upload = await fileService.upload({ files });
      const values = {
        ticketId,
        key: upload.key,
        thumbKey: upload.key,
        description,
        tags,
        isMain,
      };
      const newPhoto = new dbPhotos(values);
      const uploadedPhoto = await newPhoto.save();
      const updatePhotos = await dbTickets.findByIdAndUpdate(
        ticketId,
        {
          $push: {
            enforcerSignature: uploadedPhoto._id,
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
export const getAllViolationsFromSettings = async (
  req: Request,
  res: Response,
) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const violations = await dbViolations
      .find({}, "-__v")
      .populate({ path: "violationCategory", select: "violationCategoryName" });

    if (!violations) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: violations,
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
export const getAllPenaltiesFromSettings = async (
  req: Request,
  res: Response,
) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  if (!isBackOfficer) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const penalties = await dbPenalties.find({}, "penaltyDescription penalty");

    if (!penalties) {
      return res.json(response.error({ message: NO_RECORD_FOUND }));
    }

    res.json(
      response.success({
        items: penalties,
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

export const getReceiptById = async (req: Request, res: Response) => {
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const receiptId = req.params.receiptId;

  if (!isBackOfficer) {
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
