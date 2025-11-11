"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Typography } from "@/common/components/ui/Typography";
import { FileWithPath, useDropzone } from "react-dropzone";
import { cn } from "@/common/helpers/cn";
import usePhotoStore from "@/module/Store/usePhotoStore";
import useAddActivityPhoto from "@/module/Admin/hooks/useAddActivityPhoto";
import useGetActivityById from "@/common/hooks/Web-Contents/useGetActivityById";
import { LucideCamera, LucideUpload, LucideXCircle } from "lucide-react";
import { Button } from "@/common/components/shadcn/ui/button";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { useParams, useRouter } from "next/navigation";
import NextImage from "next/image";
import { Spinner } from "@/common/components/ui/Spinner";
import Stepper from "@/module/BreedersPage/BreederInformation/BreedersFarmDetails/components/PageStepIndicator";

const ActivityPhoto = () => {
  const params = useParams<{ contentId: string; activityId: string }>();
  const contentId = params.contentId;
  const activityId = params.activityId;
  const { data, isLoading } = useGetActivityById(activityId);
  const { mutateAsync: addMutateAsync } = useAddActivityPhoto(activityId);
  const photos = usePhotoStore((state) => state.photos);
  const setPhotos = usePhotoStore((state) => state.setPhotos);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const steps = ["Information", "Photos"];

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxFiles: 1, // Restrict to only one file
    onDrop: (acceptedPhotos: FileWithPath[]) => {
      // Ensure there's at least one photo
      if (!acceptedPhotos || acceptedPhotos.length === 0) {
        toast.error("Please upload a valid image.");
        return;
      }

      const file = acceptedPhotos[0]; // Get the first file
      if (!file) {
        toast.error("Invalid file.");
        return;
      }

      const img = new Image(); // Native Image object
      img.src = URL.createObjectURL(file); // Safely create URL for the file

      img.onload = () => {
        const maxWidth = 1280;
        const maxHeight = 720;

        // Validate image dimensions
        if (
          img.width > maxWidth ||
          img.height > maxHeight ||
          img.width === img.height
        ) {
          toast.error(
            `Invalid image dimensions. Images should be rectangular and not exceed ${maxWidth}x${maxHeight} pixels.`,
          );
        } else {
          // Valid image, set it in state
          setPhotos([
            {
              file: Object.assign(file, {
                preview: URL.createObjectURL(file),
              }),
              key: "",
              description: "",
              tags: "",
              isMain: true, // Single upload is always main
            },
          ]);
        }
      };

      img.onerror = () => {
        toast.error("Error loading image. Please try again.");
      };
    },
    onDropRejected: () => {
      toast.error("Only images are allowed.");
    },
    disabled: isLoading,
  });

  const updatePhotosInDb = async () => {
    const toAddPhotos = photos
      .filter((photo) => !photo._id)
      .map(async (photo) => await addMutateAsync(photo));
    setIsSubmitting(true);
    try {
      const items = await Promise.all(toAddPhotos);
      items.forEach((item) => {
        const message = String(item.message);
        toast.success(message, { id: message });
      });
      router.push(`/backoffice/web-contents/${contentId}/activities/view`);
    } catch (err) {
      toast.error(String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    await updatePhotosInDb();
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
  };

  useEffect(() => {
    if (!isLoading && data && data.item) {
      setPhotos(data?.item?.photos);
    }
  }, [data, isLoading]);

  return (
    <>
      <WidthWrapper width="full">
        <div
          className={cn(
            " mb-14 flex flex-col w-full space-y-4",
            isLoading && "opacity-70",
          )}
        >
          <div className="flex gap-2 items-center">
            <LucideCamera size={25} />
            <Typography fontWeight="semiBold" className="text-xl">
              {" "}
              ACTIVITY
            </Typography>
          </div>
          <div className="border-2 shadow rounded-md p-5 flex flex-col mr-12">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <LucideUpload size={20} />
                <Typography variant="h4" fontWeight="semiBold">
                  Upload Activity Photo
                </Typography>
              </div>
              <div className="flex justify-between items-center">
                <Stepper steps={steps} currentStep={2} />
              </div>
            </div>

            <div className="border-b py-2"></div>
            <div className="grid sm:grid-cols-12 pt-8 gap-6 flex-1">
              <div className="items-stretch col-span-12 space-y-4 text-gray-600">
                <Typography className="text-gray-400">Note:</Typography>
                <Typography className="text-xs text-gray-400 italic">
                  Maximum file size should not exceed 5mb <br />
                  Only PNG, JPEG and JPG is accepted <br />
                  Allowed photo dimensions are 1280 x 720 pixels and below{" "}
                  <br />
                  Maximum of one image
                </Typography>
                <div className="grid grid-cols-4 gap-6">
                  <>
                    <div className="relative h-52 w-full overflow-hidden bg-gray-400 hover:bg-gray-300 flex justify-center items-center rounded-lg hover:cursor-pointer">
                      <label
                        {...getRootProps()}
                        htmlFor="dropzone-file"
                        className={cn(
                          isLoading && "opacity-50",
                          isFocused && "opacity-100",
                          "flex flex-col items-center justify-center w-full h-52 border-2 border-primary-600 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200",
                        )}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <LucideUpload />
                          <Typography className="mb-2 text-text-500 px-2 text-center">
                            <span className="font-semibold">
                              Drop photos here
                            </span>{" "}
                            or click this
                          </Typography>
                          <Typography className="text-xs text-text-500">
                            PNG, JPG or JPEG
                          </Typography>
                        </div>
                        <input {...getInputProps()} />
                      </label>
                    </div>

                    {photos?.map((photo, index) => {
                      return !photo.isDeleted ? (
                        <div key={index} className="h-full">
                          {photo.isMain && (
                            <div className="flex justify-center">
                              <span className="absolute mt-[-16px] z-10 rounded-md bg-secondary-500 px-2 py-1 text-sm font-medium text-white">
                                Preferred main photo
                              </span>
                            </div>
                          )}
                          <button
                            className={cn(
                              `relative h-52 w-full bg-primary-50 rounded-lg`,
                              photo.isMain && "border-2 border-secondary-500",
                            )}
                            type="button"
                          >
                            <NextImage
                              src={
                                photo?.file?.preview ?? `/assets/${photo.key}`
                              }
                              alt={`preview-` + index}
                              layout="fill"
                              objectFit="cover"
                              objectPosition="center"
                              className="rounded-lg"
                            />
                            <button
                              className="absolute top-2 right-2  text-gray-400 hover:text-gray-600"
                              onClick={() => removePhoto(index)}
                            >
                              <LucideXCircle size={20} />
                            </button>
                          </button>
                        </div>
                      ) : null;
                    })}
                  </>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="mt-8 w-32"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner size="md" /> : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </WidthWrapper>
    </>
  );
};

export default ActivityPhoto;
