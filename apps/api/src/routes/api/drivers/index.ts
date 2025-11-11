import express from "express";
import {
  forgot,
  forgotVerify,
  info,
  login,
  logout,
  register,
  verifySession,
} from "./services/auth";
import isOriginValid from "@/common/middlewares/drivers-auth/isOriginValid";
import isDriverLoggedIn from "@/common/middlewares/drivers-auth/isDriverLoggedIn";
import isCsrfTokenValid from "@/common/middlewares/drivers-auth/isCsrfTokenValid";
import { updatePassword } from "./services/change-password";
import {
  getDriverInfo,
  getPersonalInfo,
  updatePersonalInfo,
} from "./services/personalInfo";
import {
  addDriverProfilePicture,
  deleteDriverProfilePicture,
} from "./services/profilePicture";

const router = express.Router();

router.get("/auth/info", isOriginValid, isDriverLoggedIn, info);

router.get(
  "/personal-info/:driverId",
  isOriginValid,
  isDriverLoggedIn,
  getPersonalInfo,
);

router.get(
  "/auth/verify-session",
  isOriginValid,
  isDriverLoggedIn,
  verifySession,
);
router.post("/auth/login", isOriginValid, login);
router.post("/auth/register", isOriginValid, register);
router.post(
  "/auth/logout",
  isOriginValid,
  isDriverLoggedIn,
  isCsrfTokenValid,
  logout,
);

//Personal Information
router.get(
  "/auth/:driverId/personal-info",
  isCsrfTokenValid,
  isOriginValid,
  isDriverLoggedIn,
  getDriverInfo,
);

router.patch(
  "/auth/:driverId/personal-info",
  isCsrfTokenValid,
  isOriginValid,
  isDriverLoggedIn,
  updatePersonalInfo,
);

router.post(
  "/auth/personal-info/:driverId/profile-picture",
  isOriginValid,
  isCsrfTokenValid,
  isDriverLoggedIn,
  addDriverProfilePicture,
);

router.delete(
  "/auth/personal-info/:driverId/profile-picture/:photoId",
  isOriginValid,
  isCsrfTokenValid,
  isDriverLoggedIn,
  deleteDriverProfilePicture,
);

//Change Password
router.patch(
  "/auth/change-password",
  isCsrfTokenValid,
  isOriginValid,
  isDriverLoggedIn,
  updatePassword,
);

//Forgot Password
router.post("/auth/forgot-password", isOriginValid, forgot);

router.post(
  "/auth/forgot-password/verify",
  isOriginValid,
  // isCsrfTokenValid,
  forgotVerify,
);

export default router;
