import {
  NO_RECORD_FOUND,
  NOT_AUTHORIZED,
  RECORD_DOES_NOT_EXIST,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbNotifications from "@/models/dbNotifications";
import dbTickets from "@/models/dbTickets";
import { E_Ticket_Status } from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();

export const getAllNotifications = async (req: Request, res: Response) => {
  const isDriver = res.locals.driver?.isDriver;
  const driverId = res.locals.driver?.id;
  if (!isDriver || !driverId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const notifications = await dbNotifications
      .find({ driver: driverId })
      .populate("driver")
      .populate({
        path: "ticket",
        select: "ticketNumber address ticketStatus violations otherViolations",
        populate: [
          { path: "address", select: "street barangay" },
          {
            path: "violations.penaltyId",
            select: "penaltyDescription penalty",
          },
          {
            path: "otherViolations.penaltyId",
            select: "penaltyDescription penalty",
          },
        ],
      })
      .sort({ createdAt: -1 });

    if (!notifications) {
      return res.json(
        response.error({
          message: NO_RECORD_FOUND,
        }),
      );
    }
    res.json(
      response.success({
        items: notifications,
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

export const getNotificationById = async (req: Request, res: Response) => {
  const isDriver = res.locals.driver?.isDriver;
  const driverId = res.locals.driver?.id;
  const notificationId = req.params.notificationId;
  if (!isDriver || !driverId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const notification = await dbNotifications
      .findOne({
        _id: notificationId,
        driver: driverId,
      })
      .populate({ path: "driver", select: "firstName lastName" })
      .populate({
        path: "ticket",
        select: "ticketNumber address ticketStatus violations otherViolations",
        populate: [
          { path: "address", select: "street barangay" },
          {
            path: "violations.penaltyId",
            select: "penaltyDescription penalty",
          },
          {
            path: "otherViolations.penaltyId",
            select: "penaltyDescription penalty",
          },
        ],
      });

    if (!notification) {
      return res.json(
        response.error({
          message: RECORD_DOES_NOT_EXIST,
        }),
      );
    }
    res.json(
      response.success({
        item: notification,
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

export const readNotificationById = async (req: Request, res: Response) => {
  const isDriver = res.locals.driver?.isDriver;
  const driverId = res.locals.driver?.id;
  const notificationId = req.params.notificationId;
  if (!isDriver || !driverId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }
  try {
    const updatedNotification = await dbNotifications.findOneAndUpdate(
      {
        _id: notificationId,
        driver: driverId,
      },
      {
        $set: { isRead: true, updatedAt: new Date() },
      },
      { new: true },
    );

    if (!updatedNotification) {
      return res.json(
        response.error({
          message: RECORD_DOES_NOT_EXIST,
        }),
      );
    }

    res.json(
      response.success({
        item: updatedNotification,
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

export const confirmTicketViolationById = async (
  req: Request,
  res: Response,
) => {
  const isDriver = res.locals.driver?.isDriver;
  const driverId = res.locals.driver?.id;
  const notificationId = req.params.notificationId; // Use notificationId from request params

  if (!isDriver || !driverId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  try {
    // Step 1: Find the notification and extract the ticket ID
    const notification = await dbNotifications.findOne({
      _id: notificationId,
      driver: driverId,
    });

    if (!notification) {
      return res.json(
        response.error({
          message: "Notification not found!",
        }),
      );
    }

    const ticketId = notification.ticket; // Extract ticket ID from the notification

    if (!ticketId) {
      return res.json(
        response.error({
          message: "No ticket is associated with this notification!",
        }),
      );
    }

    // Step 2: Update the ticket status
    const updatedTicket = await dbTickets.findOneAndUpdate(
      {
        _id: ticketId,
        driver: driverId,
      },
      {
        $set: {
          ticketStatus: E_Ticket_Status.Confirmed,
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updatedTicket) {
      return res.json(
        response.error({
          message: NO_RECORD_FOUND, // Ticket not found
        }),
      );
    }

    // Step 3: Update the notification message
    const updatedNotification = await dbNotifications.findOneAndUpdate(
      {
        _id: notificationId,
        driver: driverId,
      },
      {
        $set: {
          message: "Ticket Violation Confirmed",
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updatedNotification) {
      return res.json(
        response.error({
          message: "Failed to update notification!", // Notification update failed
        }),
      );
    }

    // Step 4: Return the updated ticket and notification
    res.json(
      response.success({
        item: updatedNotification,
        message: "Ticket Violation Confirmed",
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
