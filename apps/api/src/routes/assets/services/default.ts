import { Response, Request } from "express";
import {
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
} from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import { FileService } from "@/common/services/file";

const fileService = new FileService();
const response = new ResponseService();

export const getAsset = async (req: Request, res: Response) => {
  const download = req.query.download;
  const objKey = req.params.objKey;
  if (objKey) {
    try {
      const file = await fileService.get({ key: objKey as string });
      if (download) {
        res.send(file);
      } else {
        res.end(file);
      }
    } catch (err: any) {
      res.json(
        response.error({
          message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
        }),
      );
    }
  } else {
    res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
  }
};
