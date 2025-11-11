import express from "express";

import isBackOfficerLoggedIn from "@/common/middlewares/backOfficer-auth/isBackOfficerLoggedIn";
import isBackOfficeOriginValid from "@/common/middlewares/backOfficer-auth/isBackOfficeOriginValid";
import isBackOfficeCsrfTokenValid from "@/common/middlewares/backOfficer-auth/isBackOfficeCsrfTokenValid";
import {
  addBackOfficer,
  backOfficerForgot,
  backOfficerForgotVerify,
  backOfficerInfo,
  backOfficerLogin,
  backOfficerLogout,
  backOfficerRegister,
  backOfficerVerifySession,
} from "./services/backOfficerAuth";
import {
  getBackOfficerInfo,
  updateBackOfficerPersonalInfo,
} from "./services/backOfficerPersonalInfo";
import {
  addBackOfficerProfilePicture,
  deleteBackOfficerProfilePicture,
} from "./services/backOfficerProfilePicture";
import { updateBackOfficerPassword } from "./services/backOfficer-change-password";

const router = express.Router();

router.get(
  "/auth/info",
  isBackOfficeOriginValid,
  isBackOfficerLoggedIn,
  backOfficerInfo,
);
router.get(
  "/auth/verify-session",
  isBackOfficeOriginValid,
  isBackOfficerLoggedIn,
  backOfficerVerifySession,
);
router.post("/auth/register", isBackOfficeOriginValid, backOfficerRegister);

router.post("/auth/login", isBackOfficeOriginValid, backOfficerLogin);

router.post(
  "/auth/logout",
  isBackOfficeOriginValid,
  isBackOfficerLoggedIn,
  isBackOfficeCsrfTokenValid,
  backOfficerLogout,
);

router.post("/auth/add-backofficer", addBackOfficer);

//Personal Information
router.get(
  "/auth/:backOfficerId/personal-info",
  isBackOfficeOriginValid,
  isBackOfficerLoggedIn,
  isBackOfficeCsrfTokenValid,
  getBackOfficerInfo,
);

router.patch(
  "/auth/:backOfficerId/personal-info",
  isBackOfficeOriginValid,
  isBackOfficerLoggedIn,
  isBackOfficeCsrfTokenValid,
  updateBackOfficerPersonalInfo,
);

router.post(
  "/auth/personal-info/:backOfficerId/profile-picture",
  isBackOfficeOriginValid,
  isBackOfficerLoggedIn,
  isBackOfficeCsrfTokenValid,
  addBackOfficerProfilePicture,
);

router.delete(
  "/auth/personal-info/:backOfficerId/profile-picture/:photoId",
  isBackOfficeOriginValid,
  isBackOfficerLoggedIn,
  isBackOfficeCsrfTokenValid,
  deleteBackOfficerProfilePicture,
);

//Change Password
router.patch(
  "/auth/change-password",
  isBackOfficeOriginValid,
  isBackOfficerLoggedIn,
  isBackOfficeCsrfTokenValid,
  updateBackOfficerPassword,
);

//Forgot Password
router.post(
  "/auth/forgot-password",
  isBackOfficeOriginValid,
  backOfficerForgot,
);

router.post(
  "/auth/forgot-password/verify",
  isBackOfficeOriginValid,
  // isCsrfTokenValid,
  backOfficerForgotVerify,
);

export default router;
