"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { LucideArrowLeft, LucideRefreshCw, LucideUpload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FileWithPath, useDropzone } from "react-dropzone";
import NextImage from "next/image";
import { Spinner } from "@/common/components/ui/Spinner";
import usePhotoStore from "@/common/store/usePhotoStore";
import Link from "next/link";
import useBackOfficeSessionStore from "@/common/store/useBackOfficeSessionStore";
import useGetBackOfficerInfo from "@/common/hooks/BackOffice/useGetBackOfficerInfo";
import useAddBackOfficerProfilePicture from "@/common/hooks/BackOffice/useAddBackOfficerProfilePicture";
import useDeleteBackOfficerProfilePicture from "@/common/hooks/BackOffice/useDeleteBackOfficerProfilePicture";
import useUpdateBackOfficerInfo from "@/common/hooks/BackOffice/useUpdateBackOfficerInfo";

interface IOfficer {
  firstName: string;
  lastName: string;
  username: string;
}

const Index = () => {
  const session = useBackOfficeSessionStore((state) => state);
  const backOfficerId = String(session.id || "");
  const { data, isPending } = useGetBackOfficerInfo(backOfficerId as string);
  const [isLoading, setIsLoading] = useState(false);
  const photoId = data?.item?.profilePicture?.[0]?._id;
  const { mutateAsync: uploadProfilePicture } =
    useAddBackOfficerProfilePicture(backOfficerId);
  const { mutateAsync: updateBackOfficerInfo } =
    useUpdateBackOfficerInfo(backOfficerId);
  const { mutateAsync: removeProfilePicture } =
    useDeleteBackOfficerProfilePicture(photoId); // Hook for removing profile picture
  const photos = usePhotoStore((state) => state.photos);
  const setPhotos = usePhotoStore((state) => state.setPhotos);
  const [photo, setPhoto] = useState<FileWithPath | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IOfficer>();

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    toast.success("Photo removed!");
  };

  const handleRemoveProfilePhoto = async () => {
    try {
      const photoId = data?.item?.profilePicture?.[0]?._id; // Ensure correct extraction

      if (!photoId) {
        toast.error("No profile picture to remove!");
        return;
      }

      await removeProfilePicture({
        _id: photoId,
        description: "",
        tags: "",
      }); // Only pass `_id`

      toast.success("Profile picture removed successfully!");
      setPhotoPreview(null);
    } catch (err) {
      toast.error("Failed to remove profile picture.");
      console.error("Error removing profile picture:", err);
    }
  };

  const updatePhotosInDb = async () => {
    const toAddPhotos = photos
      .filter((photo) => !photo._id)
      .map(async (photo) => await uploadProfilePicture(photo));
    try {
      const items = await Promise.all(toAddPhotos);
      items.forEach((item) => {
        const message = String(item.message);
        toast.success(message, { id: message });
      });
    } catch (err) {
      toast.error(String(err));
    }
  };
  const handleSave = async () => {
    await updatePhotosInDb();
  };

  const onSubmit = async (formData: IOfficer) => {
    try {
      setIsLoading(true);
      const modifiedFormData = {
        ...formData,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
      };
      const response = await updateBackOfficerInfo(modifiedFormData);
      if (!response.error) {
        toast.success("Information updated successfully!");
      } else {
        toast.error("Failed to update information.");
      }
      if (photos.length > 0) {
        await handleSave();
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [], "image/jpg": [] },
    maxFiles: 1,
    disabled: !!photoPreview, // ✅ Disable if a profile picture is present
    onDrop: (acceptedFiles) => {
      if (photoPreview) {
        toast.error(
          "Remove the current profile picture first before uploading a new one!",
        );
        return;
      }

      const file = acceptedFiles[0];
      if (!file) {
        toast.error("Invalid file. Please upload a valid image.");
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const newPhoto = {
          file,
          description: "",
          tags: "",
          isMain: photos.length === 0,
        };
        setPhotos([...photos, newPhoto]);
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
        toast.success("Photo uploaded successfully!");
      };

      img.onerror = () => {
        toast.error("Error loading image. Please try again.");
      };
    },
    onDropRejected: () => {
      toast.error("Only PNG, JPEG, or JPG files are allowed.");
    },
  });

  useEffect(() => {
    if (!isPending && data?.item) {
      setValue("firstName", data?.item?.firstName || "N/A");
      setValue("lastName", data?.item?.lastName || "N/A");
      setValue("username", data?.item?.username || "N/A");

      if (data?.item?.profilePicture?.[0]?.key) {
        setPhotoPreview(`/assets/${data.item.profilePicture[0].key}`);
      }
    }
  }, [data, isPending, setValue]);

  return (
    <WidthWrapper width="full">
      <div className="bg-[url('/Aerial_Shot.png')] bg-cover bg-center w-full min-h-screen flex justify-center items-center">
        <div className="sm:p-2 md:p-8 w-full flex justify-center">
          <div className="bg-primary bg-opacity-80 rounded-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-3/4 max-w-6xl mx-auto min-h-[90vh] sm:p-8 md:px-32 shadow-lg flex flex-col justify-center">
            {isPending ? (
              <Spinner size="md">Loading...</Spinner>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl mx-auto">
                <Typography
                  variant="h2"
                  className="text-center font-bold text-black mb-6"
                >
                  Update Personal Information
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                  <div className="flex flex-col items-center space-y-4 mb-4 relative">
                    {/* Profile Photo Section */}
                    <div className="relative">
                      <div
                        {...getRootProps()}
                        className={`relative h-40 w-40 overflow-hidden bg-gray-100 ${
                          photo || data?.item?.profilePicture?.length
                            ? "cursor-default border-4 border-red-500" // Added black border
                            : "hover:bg-gray-200 border-2 border-dashed cursor-pointer"
                        } rounded-full flex items-center justify-center`}
                      >
                        {photoPreview ? (
                          <div className="relative w-full h-full">
                            <NextImage
                              src={photoPreview}
                              alt="Preview"
                              layout="fill"
                              objectFit="cover"
                              className="rounded-full"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            <LucideUpload size={24} />
                            <span className="text-xs mt-2 text-center">
                              Click here or drop photo
                            </span>
                          </div>
                        )}
                        <input
                          {...getInputProps()}
                          disabled={
                            !!photo || !!data?.item?.profilePicture?.length
                          }
                        />
                      </div>

                      {/* Overlapping Remove Buttons */}
                      {data?.item?.profilePicture?.length > 0 && !photo && (
                        <button
                          type="button"
                          onClick={handleRemoveProfilePhoto}
                          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full shadow-lg hover:bg-red-600 transition text-sm font-semibold z-10 border-4 border-red-500" // Added black border
                        >
                          Remove
                        </button>
                      )}
                      {photo && (
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full shadow-lg hover:bg-red-600 transition text-sm font-semibold z-10 border-4 border-red-500" // Added black border
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="block text-gray-700 font-bold "
                      >
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="Enter First Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="block text-gray-700 font-bold "
                      >
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Enter Last Name"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="username"
                        className="block text-gray-700 font-bold x"
                      >
                        Username
                      </label>
                      <Input
                        id="username"
                        {...register("username")}
                        placeholder="Enter Username"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-32 sm:w-auto bg-secondary hover:bg-blue-400 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        <LucideRefreshCw size={18} />
                      )}{" "}
                      Update
                    </Button>
                    <Link
                      href={`/treasurer/dashboard`}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        type="button"
                        size="lg"
                        className="w-full md:w-32 sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                      >
                        <LucideArrowLeft size={18} /> Back
                      </Button>
                    </Link>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default Index;
