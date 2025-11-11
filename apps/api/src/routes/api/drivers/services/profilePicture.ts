import {
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
  NOT_AUTHORIZED,
} from "@/common/constants";
import { FileService } from "@/common/services/file";
import { ResponseService } from "@/common/services/response";
import dbDrivers from "@/models/dbDrivers";
import dbPhotos from "@/models/dbPhotos";
import { Z_Photo } from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();
const fileService = new FileService();

export const addDriverProfilePicture = async (req: Request, res: Response) => {
  const driverId = req.params.driverId;
  const isDriver = res.locals.driver?.isDriver;
  const files = req.files;
  const { description, tags, isMain } = req.body;
  const isValidInput = Z_Photo.safeParse(req.body);

  if (!isDriver) {
    return res.json(
      response.error({
        message: NOT_AUTHORIZED,
      }),
    );
  }

  if (!files || !driverId) {
    return res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
  }
  if (isValidInput.success) {
    try {
      const upload = await fileService.upload({ files });
      const values = {
        driverId,
        key: upload.key,
        thumbKey: upload.key,
        description,
        tags,
        isMain,
      };
      const newPhoto = new dbPhotos(values);
      const uploadedPhoto = await newPhoto.save();
      const updatePhotos = await dbDrivers.findByIdAndUpdate(
        driverId,
        {
          $push: {
            profilePicture: uploadedPhoto._id,
          },
          $set: {
            updatedAt: new Date(),
          },
        },
        { new: true },
      );
      res.json(
        response.success({
          item: updatePhotos,
          message: "Photos was updated",
        }),
      );
    } catch (err: any) {
      return res.json(
        response.error({
          message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
        }),
      );
    }
  } else {
    return res.json(
      response.error({ message: JSON.parse(isValidInput.error.message) }),
    );
  }
};

export const deleteDriverProfilePicture = async (
  req: Request,
  res: Response,
) => {
  const isDriver = res.locals.driver?.isDriver;
  const driverId = req.params.driverId;
  const photoId = req.params.photoId;
  if (!isDriver) {
    res.json(response.error({ message: NOT_AUTHORIZED }));
  } else {
    if (!driverId || !photoId) {
      res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
    } else {
      try {
        const getProfilePicture = await dbPhotos.findOne({
          _id: photoId,
          deletedAt: null,
        });
        if (!getProfilePicture) {
          res.json(response.error({ message: "Profile picture not found!" }));
        } else {
          const deletePhoto = await dbPhotos.findByIdAndDelete(photoId);
          await dbDrivers.findByIdAndUpdate(
            getProfilePicture?.driverId,
            {
              $pull: {
                photos: photoId,
              },
              $set: {
                updatedAt: new Date(),
              },
            },
            { new: true },
          );
          res.json(
            response.success({
              item: deletePhoto,
              message: "Photos was updated",
            }),
          );
        }
      } catch (err: any) {
        res.json(
          response.error({
            message: err.message ? err.message : UNKNOWN_ERROR_OCCURRED,
          }),
        );
      }
    }
  }
};
