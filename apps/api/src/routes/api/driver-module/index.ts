import express from "express";
import {
  getAllViolationsFromSettings,
  getAllViolationsRecord,
  getReceiptByTicket,
  getViolationRecordById,
} from "./services/violations-record";
import isCsrfTokenValid from "@/common/middlewares/drivers-auth/isCsrfTokenValid";
import isOriginValid from "@/common/middlewares/drivers-auth/isOriginValid";
import isDriverLoggedIn from "@/common/middlewares/drivers-auth/isDriverLoggedIn";
import {
  confirmTicketViolationById,
  getAllNotifications,
  getNotificationById,
  readNotificationById,
} from "./services/notifications";
import { getReceptById } from "./services/receipts";
import { addFeedback } from "./services/feedbacks";

const router = express.Router();

// Violations Record
router.get(
  "/violations-record",
  isDriverLoggedIn,
  isCsrfTokenValid,
  isOriginValid,
  getAllViolationsRecord,
);

router.get(
  "/violations-record/:recordId",
  isDriverLoggedIn,
  isCsrfTokenValid,
  isOriginValid,
  getViolationRecordById,
);

// Notifications
router.get(
  "/notifications",
  isDriverLoggedIn,
  isCsrfTokenValid,
  isOriginValid,
  getAllNotifications,
);

router.get(
  "/notifications/:notificationId",
  isDriverLoggedIn,
  isCsrfTokenValid,
  isOriginValid,
  getNotificationById,
);

router.patch(
  "/notifications/:notificationId/read",
  isDriverLoggedIn,
  isCsrfTokenValid,
  isOriginValid,
  readNotificationById,
);

router.patch(
  "/notifications/:notificationId/confirm",
  isDriverLoggedIn,
  isCsrfTokenValid,
  isOriginValid,
  confirmTicketViolationById,
);

// Receipts
router.get(
  "/receipts/generated/:receiptId",
  isDriverLoggedIn,
  isCsrfTokenValid,
  isOriginValid,
  getReceptById,
);

router.get(
  "/violations-record/receipts/generated/:recordId",
  isDriverLoggedIn,
  isCsrfTokenValid,
  isOriginValid,
  getReceiptByTicket,
);

// Violations from Settings
router.get(
  "/settings/violations",
  isDriverLoggedIn,
  isCsrfTokenValid,
  isOriginValid,
  getAllViolationsFromSettings,
);

// Feedbacks
router.post(
  "/tickets/:enforcerId/feedback",
  isDriverLoggedIn,
  isCsrfTokenValid,
  isOriginValid,
  addFeedback,
);

export default router;
