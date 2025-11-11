import {
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
  NOT_AUTHORIZED,
} from "@/common/constants";
import { FileService } from "@/common/services/file";
import { ResponseService } from "@/common/services/response";
import dbBackOfficers from "@/models/dbBackOfficers";
import dbPhotos from "@/models/dbPhotos";
import { Z_Photo } from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();
const fileService = new FileService();

export const addBackOfficerProfilePicture = async (
  req: Request,
  res: Response,
) => {
  const backOfficerId = req.params.backOfficerId;
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const files = req.files;
  const { description, tags, isMain } = req.body;
  const isValidInput = Z_Photo.safeParse(req.body);

  if (!isBackOfficer) {
    return res.json(
      response.error({
        message: NOT_AUTHORIZED,
      }),
    );
  }

  if (!files || !backOfficerId) {
    return res.json(response.error({ message: REQUIRED_VALUE_EMPTY }));
  }
  if (isValidInput.success) {
    try {
      const upload = await fileService.upload({ files });
      const values = {
        backOfficerId,
        key: upload.key,
        thumbKey: upload.key,
        description,
        tags,
        isMain,
      };
      const newPhoto = new dbPhotos(values);
      const uploadedPhoto = await newPhoto.save();
      const updatePhotos = await dbBackOfficers.findByIdAndUpdate(
        backOfficerId,
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

export const deleteBackOfficerProfilePicture = async (
  req: Request,
  res: Response,
) => {
  const backOfficerId = req.params.backOfficerId;
  const isBackOfficer = res.locals.backOfficer?.isBackOfficer;
  const photoId = req.params.photoId;
  if (!isBackOfficer) {
    res.json(response.error({ message: NOT_AUTHORIZED }));
  } else {
    if (!backOfficerId || !photoId) {
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
          await dbBackOfficers.findByIdAndUpdate(
            getProfilePicture?.backOfficerId,
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
