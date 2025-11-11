import { Application } from "express";
import assetsRoute from "./assets";
import backOfficeRoute from "./api/back-office";
import driversRoute from "./api/drivers";
import adminModuleRoute from "./api/admin-module";
import enforcerModuleRoute from "./api/enforcer-module";
import treasurerModuleRoute from "./api/treasurer-module";
import driverModuleRoute from "./api/driver-module";

import { API_ROOT } from "@repo/constants";

export default function (app: Application) {
  app.use(`/assets`, assetsRoute);
  app.use(`${API_ROOT}/backoffice`, backOfficeRoute);
  app.use(`${API_ROOT}/drivers`, driversRoute);
  app.use(`${API_ROOT}/admin-module`, adminModuleRoute);
  app.use(`${API_ROOT}/enforcer-module`, enforcerModuleRoute);
  app.use(`${API_ROOT}/treasurer-module`, treasurerModuleRoute);
  app.use(`${API_ROOT}/driver-module`, driverModuleRoute);
}
