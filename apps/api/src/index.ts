import express from "express";
import cors from "cors";
import { ALLOWED_CLIENTS, PORT } from "@/common/constants/ev";
import routes from "@/routes";
import "@/common/utils/mongodb";
import "@/common/utils/redisClient";
import fileupload from "express-fileupload";
import cookies from "cookie-parser";
import "./system-generated/job/notificationChecker";
import "./system-generated/job/updaterScheduler";

const es = express();
es.disable("x-powered-by");
es.use(cookies());
es.use(express.json());
es.use(fileupload());
es.use(
  cors({
    origin: ALLOWED_CLIENTS,
    credentials: true,
  }),
);

routes(es);

es.listen(PORT, () => {
  console.log(`🟢 API Server is running at port ${PORT}`);
});
