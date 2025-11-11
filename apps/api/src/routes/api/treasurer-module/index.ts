import isBackOfficeCsrfTokenValid from "@/common/middlewares/backOfficer-auth/isBackOfficeCsrfTokenValid";
import isBackOfficeOriginValid from "@/common/middlewares/backOfficer-auth/isBackOfficeOriginValid";
import isBackOfficerLoggedIn from "@/common/middlewares/backOfficer-auth/isBackOfficerLoggedIn";
import express from "express";
import {
  addReceipt,
  addTreasurerSignature,
  getAllReceipts,
  getReceptById,
} from "./services/receipts";
import { getAllTickets, getTicketById } from "./services/tickets";

const router = express.Router();

// Receipts
router.post(
  "/receipts/generate",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  addReceipt,
);

router.get(
  "/receipts/generated/list",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllReceipts,
);

router.get(
  "/receipts/generated/:receiptId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getReceptById,
);

router.post(
  "/receipts/generated/:receiptId/e-signature",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  addTreasurerSignature,
);

// Tickets
router.get(
  "/tickets/citation-ticket/generated/list",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllTickets,
);

router.get(
  "/tickets/citation-ticket/generated/:ticketId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getTicketById,
);

export default router;
