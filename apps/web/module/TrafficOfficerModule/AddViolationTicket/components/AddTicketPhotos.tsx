"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useDropzone } from "react-dropzone";
import NextImage from "next/image";
import toast from "react-hot-toast";
import useAddProofOfViolation from "@/common/hooks/Enforcers/useAddProofOfViolation";
import useAddEnforcerSignature from "@/common/hooks/Enforcers/useAddEnforcerSignature";
import { useSearchParams, useRouter } from "next/navigation";

const AddTicketPhotos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const ticketId = searchParams.get("ticketId");
  const { mutateAsync: uploadProofOfViolation } = useAddProofOfViolation(
    ticketId || "",
  );
  const { mutateAsync: uploadESignature } = useAddEnforcerSignature(
    ticketId || "",
  );

  // ✅ Ticket Photo States
  const [ticketPhoto, setTicketPhoto] = useState<File | null>(null);
  const [ticketPhotoPreview, setTicketPhotoPreview] = useState<string | null>(
    null,
  );
  // ✅ E-Signature States
  const [signaturePhoto, setSignaturePhoto] = useState<File | null>(null);
  const [signaturePhotoPreview, setSignaturePhotoPreview] = useState<
    string | null
  >(null);
  // ✅ Capture Photo from Camera
  const captureTicketPhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setTicketPhotoPreview(imageSrc);

        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "captured_image.jpg", {
              type: "image/jpeg",
            });
            setTicketPhoto(file);
          });

        setUseCamera(false); // Close webcam after capture
        toast.success("Photo captured successfully!");
      } else {
        toast.error("Failed to capture photo. Please try again.");
      }
    }
  };

  // ✅ Handle Image Upload (Drag & Drop or Click)
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [] },
    maxFiles: 1,
    noClick: true, // Prevent auto click trigger when dropping files
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) {
        toast.error("Invalid file. Please upload a valid image.");
        return;
      }

      setTicketPhoto(file);
      setTicketPhotoPreview(URL.createObjectURL(file));
      toast.success("Ticket photo uploaded successfully!");
    },
    onDropRejected: () => {
      toast.error("Only PNG, JPEG files are allowed.");
    },
  });

  // ✅ Remove Ticket Photo
  const removeTicketPhoto = () => {
    setTicketPhoto(null);
    setTicketPhotoPreview(null);
    toast.success("Ticket photo removed!");
  };

  // ✅ Upload E-Signature
  const {
    getRootProps: getSignatureRootProps,
    getInputProps: getSignatureInputProps,
  } = useDropzone({
    accept: { "image/png": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) {
        toast.error("Invalid file. Please upload a valid image.");
        return;
      }
      setSignaturePhoto(file);
      setSignaturePhotoPreview(URL.createObjectURL(file));
      toast.success("Signature uploaded successfully!");
    },
    onDropRejected: () => {
      toast.error("Only PNG files are allowed for signatures.");
    },
  });

  // ✅ Remove Signature
  const removeSignaturePhoto = () => {
    setSignaturePhoto(null);
    setSignaturePhotoPreview(null);
    toast.success("Signature removed!");
  };

  // ✅ Handle Form Submission
  const onSubmit = async () => {
    try {
      setIsLoading(true);
      if (!ticketPhoto || !signaturePhoto) {
        toast.error("Please upload both ticket photo and e-signature.");
        return;
      }

      // ✅ Upload Proof of Violation
      await uploadProofOfViolation({
        isMain: true,
        file: ticketPhoto,
        description: "Proof of Violation",
        tags: "ticket,violation",
      });

      // ✅ Upload Enforcer Signature
      await uploadESignature({
        isMain: false,
        file: signaturePhoto,
        description: "Enforcer Signature",
        tags: "signature",
      });

      toast.success("Files uploaded successfully!");
      setTicketPhoto(null);
      setTicketPhotoPreview(null);
      setSignaturePhoto(null);
      setSignaturePhotoPreview(null);

      // ✅ Redirect to the specified URL
      router.push("/officer/add-violation-ticket");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WidthWrapper width="full">
      <div className="w-full min-h-screen flex justify-center items-center bg-[url('/Aerial_Shot.png')] bg-cover bg-center">
        <div className="w-full flex justify-center">
          <div className="bg-primary bg-opacity-80 rounded-lg w-11/12 md:w-3/4 max-w-5xl mx-auto min-h-[90vh] sm:p-8 md:px-32 shadow-lg flex flex-col justify-center">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg mx-auto">
              <Typography
                variant="h2"
                className="text-center font-bold text-black mb-6"
              >
                ADD TICKET PHOTO
              </Typography>

              {/* ✅ Ticket Photo Capture / Upload */}
              <div className="flex flex-col items-center space-y-4 mb-4">
                <div
                  {...getRootProps()}
                  className="relative h-40 w-40 bg-gray-100 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      // Open file input on mobile
                      document.getElementById("mobileCameraInput")?.click();
                    } else {
                      // Open Webcam on desktop
                      setUseCamera(true);
                    }
                  }}
                >
                  {useCamera ? (
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      videoConstraints={{
                        width: 300,
                        height: 300,
                        facingMode: "environment",
                      }}
                    />
                  ) : ticketPhotoPreview ? (
                    <NextImage
                      src={ticketPhotoPreview}
                      alt="Ticket Preview"
                      layout="fill"
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-600 text-center leading-normal">
                      *Capture image as proof of ticket violation
                    </span>
                  )}

                  {/* ✅ Hidden File Input for Mobile Camera */}
                  <input
                    type="file"
                    id="mobileCameraInput"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setTicketPhoto(file);
                        setTicketPhotoPreview(URL.createObjectURL(file));
                        toast.success("Ticket photo uploaded successfully!");
                      }
                    }}
                  />

                  {!useCamera && <input {...getInputProps()} />}
                </div>

                {/* ✅ Capture Button (Only for Desktop Webcam) */}
                {useCamera && (
                  <Button
                    onClick={captureTicketPhoto}
                    className="mt-3 bg-blue-500 text-white px-6 py-2 rounded-md"
                  >
                    Capture Photo
                  </Button>
                )}

                {/* ✅ Remove Button (If Image Exists) */}
                {ticketPhotoPreview && (
                  <Button
                    onClick={removeTicketPhoto}
                    className="bg-red-500 hover:bg-red-300 text-white px-4 py-2 rounded-lg"
                  >
                    Remove Ticket Photo
                  </Button>
                )}
              </div>

              {/* ✅ E-Signature Upload (Same Size as Ticket Photo Dropzone) */}
              <div className="flex flex-col items-center space-y-4 mb-4">
                <div
                  {...getSignatureRootProps()}
                  className="relative h-40 w-40 bg-gray-100 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer"
                >
                  {signaturePhotoPreview ? (
                    <NextImage
                      src={signaturePhotoPreview}
                      alt="Signature Preview"
                      layout="fill"
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-600 text-center">
                      *Upload your E-Signature (PNG format recommended)
                    </span>
                  )}
                  <input {...getSignatureInputProps()} />
                </div>

                {signaturePhotoPreview && (
                  <Button
                    onClick={removeSignaturePhoto}
                    className="bg-red-500 hover:bg-red-300 text-white px-4 py-2 rounded-lg"
                  >
                    Remove Signature
                  </Button>
                )}
              </div>

              <Button
                onClick={onSubmit}
                className="mt-4 w-full bg-secondary hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
              >
                {isLoading ? "Submitting..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default AddTicketPhotos;
