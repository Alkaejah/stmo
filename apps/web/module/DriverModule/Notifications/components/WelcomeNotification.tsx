"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useGetNotificationById from "@/common/hooks/Drivers/module/useGetNotificationById";
import { LucideArrowLeft, LucideCopy } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const WelcomeNotification = () => {
  const params = useParams();
  const rawNotificationId = params.selectedNotificationId;
  const notificationId =
    typeof rawNotificationId === "string" ? rawNotificationId : undefined;
  const { data, isPending } = useGetNotificationById(notificationId);
  const router = useRouter();

  const handleRedirectBack = () => {
    router.push(`/driver/notification`);
  };

  const welcomeData = {
    subject: data?.item?.subject || "No Subject",
    name: data?.item?.driver.firstName + " " + data?.item?.driver.lastName,
    content: data?.item?.content || "N/A",
  };

  return (
    <WidthWrapper width="full">
      <div className="relative w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 sm:px-6 md:px-8 lg:px-8 md:py-8 lg:py-8">
        <div className="relative z-10 w-full max-w-full h-[90vh] bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-14">
          <div className="flex">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl flex flex-col justify-between h-[550px]">
              <div className="flex justify-center mb-4 md:mb-12">
                <Image
                  src="/etravio.png"
                  width={200}
                  height={150}
                  alt="Welcome"
                  className="bg-primary object-cover p-2"
                />
              </div>
              <h1 className="text-2xl font-bold mb-4">{welcomeData.subject}</h1>
              <Typography className="mb-4">Hi {welcomeData.name},</Typography>
              <Typography className="mb-4">
                This is your Driver Control Number:
                <span className="font-bold text-secondary flex items-center">
                  {welcomeData.content}
                  <LucideCopy
                    className="w-4 h-4 ml-1 mt-1 cursor-pointer text-gray-400 hover:text-gray-300"
                    onClick={() => {
                      navigator.clipboard.writeText(welcomeData.content || "");
                      toast.success("DCN copied!"); // Optional toast notification
                    }}
                  />
                </span>
              </Typography>
              <Typography className="mb-4">
                Please save a copy of your Driver Control Number for future
                usage and references. Thank you for signing up at
                <span className="font-semibold text-secondary"> ETRAVIO</span>,
                ride safe and drive responsibly.
              </Typography>
              <Typography className="mb-4">
                Best regards,
                <br />
                The <span className="font-bold text-secondary">
                  ETRAVIO
                </span>{" "}
                Team
              </Typography>
              <Button
                size="default"
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white w-full sm:w-auto md:w-32 font-bold py-2 px-4 rounded flex items-center gap-2 mt-auto"
                onClick={handleRedirectBack}
              >
                <LucideArrowLeft size={18} /> Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default WelcomeNotification;
