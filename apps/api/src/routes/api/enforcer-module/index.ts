import isBackOfficeCsrfTokenValid from "@/common/middlewares/backOfficer-auth/isBackOfficeCsrfTokenValid";
import isBackOfficeOriginValid from "@/common/middlewares/backOfficer-auth/isBackOfficeOriginValid";
import isBackOfficerLoggedIn from "@/common/middlewares/backOfficer-auth/isBackOfficerLoggedIn";
import express from "express";
import {
  addEnforcerSignature,
  addProofOfViolation,
  addTicket,
  checkViolationCount,
  getAllPenaltiesFromSettings,
  getAllTickets,
  getAllViolationsFromSettings,
  getReceiptById,
  getTicketById,
  getTicketsPerDay,
} from "./services/ticket";
import { addDriver } from "./services/drivers";

const router = express.Router();

// Tickets
router.post(
  "/tickets/citation-ticket/generate",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  addTicket,
);

router.post(
  "/tickets/citation-ticket/generated/violation-count",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  checkViolationCount,
);

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

//TODO: For Verification
router.get(
  "/tickets/violators/analytics",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getTicketsPerDay,
);

router.post(
  "/tickets/tickets/citation-ticket/generated/:ticketId/proof",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  addProofOfViolation,
);

router.post(
  "/tickets/tickets/citation-ticket/generated/:ticketId/e-signature",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  addEnforcerSignature,
);

// Drivers
router.post(
  "/drivers/add-driver",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  addDriver,
);
// Violations from Settings
router.get(
  "/settings/violations",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllViolationsFromSettings,
);

// Penalties from Settings
router.get(
  "/settings/penalties",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllPenaltiesFromSettings,
);
router.get(
  "/tickets/receipt/generated/:receiptId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getReceiptById,
);

export default router;
