import { NextFunction, Request, Response } from "express";
import { ResponseService } from "@/common/services/response";
import { NOT_AUTHORIZED } from "@/common/constants";
import { NODE_ENV, WEB_URL } from "@/common/constants/ev";

const response = new ResponseService();

const isBackOfficeOriginValid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (NODE_ENV === "production") {
    const origin = req.headers["origin"];
    const referer = req.headers["referer"];
    const proxy = req.headers["x-forwarded-host"];
    if ((origin && referer) || proxy) {
      const isValid =
        (String(referer).startsWith(WEB_URL) && origin === WEB_URL) ||
        WEB_URL.includes(proxy as string);
      if (isValid) {
        next();
      } else {
        res.json(
          response.error({
            message: NOT_AUTHORIZED,
          }),
        );
      }
    } else {
      res.json(
        response.error({
          message: NOT_AUTHORIZED,
        }),
      );
    }
  } else {
    next();
  }
};

export default isBackOfficeOriginValid;
