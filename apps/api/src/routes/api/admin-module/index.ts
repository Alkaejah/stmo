import isBackOfficeCsrfTokenValid from "@/common/middlewares/backOfficer-auth/isBackOfficeCsrfTokenValid";
import isBackOfficeOriginValid from "@/common/middlewares/backOfficer-auth/isBackOfficeOriginValid";
import isBackOfficerLoggedIn from "@/common/middlewares/backOfficer-auth/isBackOfficerLoggedIn";
import express from "express";
import {
  addViolationCategory,
  deleteViolationCategory,
  getAllViolationCategories,
  getViolationCategoryById,
  updateViolationCategory,
} from "./services/violationCategory";

import { addViolation, getAllViolations } from "./services/violation";
import {
  addPenalty,
  getAllPenalties,
  updatePenaltyById,
} from "./services/penalties";
import {
  addViolationAddress,
  getAllViolationAddress,
  getViolationAddressById,
} from "./services/violationAddress";
import {
  getAllDrivers,
  getDriverById,
  uploadDriversCSV,
} from "./services/drivers";
import {
  addHistoricalTicket,
  getAllHistoricalTickets,
  getHistoricalTicketById,
  uploadHistoricalTicketsCSV,
} from "./services/historical-tickets";
import {
  getAllTickets,
  getAllTicketsForAdmin,
  getAllTicketsForVisualization,
  getTicketByIdForAdmin,
} from "./services/tickets";
import {
  deactivateBackOfficerAccount,
  deactivateDriverAccount,
  getAllBackOfficersAccount,
  getAllDriversAccount,
} from "./services/accounts";
import { getAllTicketsForDataset } from "./services/datasets";
import {
  getAllDriversFeedbacks,
  getAllEnforcersForEvaluation,
  getAllReceivedFeedbacksByEnforcerId,
  getFeedbacksSummaryByEnforcerId,
} from "./services/evaluations";
import {
  getAllEnforcerForScheduling,
  updateScheduleTime,
} from "./services/scheduling";

const router = express.Router();

// Violation Category
router.post(
  "/settings/violation-category",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  addViolationCategory,
);

router.get(
  "/settings/violation-category",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllViolationCategories,
);

router.get(
  "/settings/violation-category/:violationCategoryId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getViolationCategoryById,
);

router.patch(
  "/settings/violation-category/:violationCategoryId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  updateViolationCategory,
);

router.delete(
  "/settings/violation-category/:violationCategoryId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  deleteViolationCategory,
);

// Penalty
router.post(
  "/settings/penalties",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  addPenalty,
);

router.patch(
  "/settings/penalties/:penaltyId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  updatePenaltyById,
);

router.get(
  "/settings/penalties",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllPenalties,
);

// Violation
router.post(
  "/settings/violations",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  addViolation,
);

router.get(
  "/settings/violations",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllViolations,
);

// Violation Address
router.post(
  "/settings/violation-address",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  addViolationAddress,
);

router.get(
  "/settings/violation-address",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllViolationAddress,
);

router.get(
  "/settings/violation-address/:violationAddressId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getViolationAddressById,
);

// Drivers
router.post(
  "/drivers/upload",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  uploadDriversCSV,
);

router.get(
  "/drivers/list",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllDrivers,
);

router.get(
  "/drivers/:driverId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getDriverById,
);

// Historical Tickets
router.post(
  "/tickets/historical",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  addHistoricalTicket,
);

router.post(
  "/tickets/historical/upload",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  uploadHistoricalTicketsCSV,
);

router.get(
  "/tickets/historical",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllHistoricalTickets,
);

router.get(
  "/tickets/historical/:historicalTicketId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getHistoricalTicketById,
);

// System Generated Tickets
router.get(
  "/tickets/citation-ticket/generated/list/map/dist",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllTickets,
);

router.get(
  "/tickets/citation-ticket/generated/list/graph/dist",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllTicketsForVisualization,
);

// Tickets for Admin
router.get(
  "/tickets",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllTicketsForAdmin,
);

router.get(
  "/tickets/:ticketId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getTicketByIdForAdmin,
);

// Drivers Accounts
router.get(
  "/accounts/list/drivers",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllDriversAccount,
);

router.patch(
  "/accounts/drivers/status/:driverId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  deactivateDriverAccount,
);

// Officers Accounts
router.get(
  "/accounts/list/officers",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllBackOfficersAccount,
);

router.patch(
  "/accounts/officers/status/:backOfficerId",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  deactivateBackOfficerAccount,
);

// Datasets
router.get(
  "/datasets",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllTicketsForDataset,
);

// Evaluations
router.get(
  "/accounts/enforcers/evaluation",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllEnforcersForEvaluation,
);

router.get(
  "/feedbacks/:enforcerId/list",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllReceivedFeedbacksByEnforcerId,
);

router.get(
  "/feedbacks/:enforcerId/summary",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getFeedbacksSummaryByEnforcerId,
);

// Scheduling
router.get(
  "/enforcers/scheduling",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  getAllEnforcerForScheduling,
);

router.patch(
  "/enforcers/:enforcerId/scheduling/update-time",
  isBackOfficerLoggedIn,
  isBackOfficeOriginValid,
  isBackOfficeCsrfTokenValid,
  updateScheduleTime,
);

export default router;
