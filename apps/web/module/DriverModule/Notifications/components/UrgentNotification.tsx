"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useGetNotificationById from "@/common/hooks/Drivers/module/useGetNotificationById";
import { format, parseISO } from "date-fns";
import { LucideArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import {
  IOtherViolationsPenalty,
  IViolationsPenalty,
} from "@/common/types/global";

const UrgentNotification = () => {
  const params = useParams();
  const rawNotificationId = params.selectedNotificationId;
  const notificationId =
    typeof rawNotificationId === "string" ? rawNotificationId : undefined;

  const { data, isPending } = useGetNotificationById(notificationId);
  const router = useRouter();

  const handleRedirectBack = () => {
    router.push(`/driver/notification`);
  };

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "";
    if (typeof date === "string") {
      return format(parseISO(date), "MMMM dd, yyyy");
    }
    if (date instanceof Date) {
      return format(date, "MM/dd/yyyy");
    }
    return "";
  };

  // Calculate total penalty amount
  const totalPenalty =
    (data?.item?.ticket?.violations?.reduce(
      (sum: number, violation: IViolationsPenalty) => {
        return sum + (violation.penaltyId?.penalty || 0);
      },
      0,
    ) || 0) +
    (data?.item?.ticket?.otherViolations?.reduce(
      (sum: number, otherViolation: IOtherViolationsPenalty) => {
        return sum + (otherViolation.penaltyId?.penalty || 0);
      },
      0,
    ) || 0);

  const urgentNotificationData = {
    subject: data?.item?.subject || "No Subject",
    name: data?.item?.driver?.firstName + " " + data?.item?.driver?.lastName,
    violationId: data?.item?.ticket?.ticketNumber || "N/A",
    violationDate: formatDate(data?.item?.createdAt),
    location: data?.item?.ticket?.address
      ? `${data?.item?.ticket?.address?.street?.street || "Unknown Street"}, ${data?.item?.ticket?.address?.barangay?.barangay || "Unknown Barangay"}`
      : "N/A",
    totalPenalty,
  };

  return (
    <WidthWrapper width="full">
      <div className="relative w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 py-8">
        <div className="relative z-10 w-full max-w-full h-auto md:h-[90vh] lg:h-[90vh] bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col justify-center items-center p-6">
          <div className="flex">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl flex flex-col justify-between h-auto overflow-y-auto">
              <div className="flex justify-center mb-4 md:mb-12">
                <Image
                  src="/etravio.png"
                  width={200}
                  height={150}
                  alt="Welcome"
                  className="bg-primary object-cover p-2"
                />
              </div>
              <Typography className="text-lg font-bold mb-2">
                {urgentNotificationData.subject}
              </Typography>
              <Typography>
                Dear{" "}
                <span className="font-bold text-secondary">
                  {urgentNotificationData.name}
                </span>
              </Typography>
              <Typography className="my-2">
                We are writing to notify you that your ticket violation has
                exceeded the 72-hours confirmation and payment window. Immediate
                action is required to resolve this matter and avoid additional
                penalties.
              </Typography>
              <Typography className="text-lg font-bold mb-2">
                Ticket Details:
              </Typography>
              <div>
                <ul>
                  <li>
                    <Typography>
                      Ticket Number:{" "}
                      <span className="font-bold text-secondary">
                        {urgentNotificationData.violationId}
                      </span>
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Date of Violation:{" "}
                      <span className="font-bold text-secondary">
                        {urgentNotificationData.violationDate}
                      </span>
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Location:{" "}
                      <span className="font-bold text-secondary">
                        {urgentNotificationData.location}
                      </span>
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Total Fine/Penalty:{" "}
                      <span className="font-bold text-secondary">
                        ₱
                        {urgentNotificationData.totalPenalty.toLocaleString(
                          "en-US",
                          { minimumFractionDigits: 2 },
                        )}
                      </span>
                    </Typography>
                  </li>
                </ul>
              </div>
              <Typography className="my-2">
                As the deadline has passed, you may now be subject to additional
                fines or legal actions. Please contact our office first or visit
                the Municipal Treasury to settle your violation immediately.
                Failure to address this ticket may result in further escalation.
              </Typography>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-2 md:justify-between mt-6">
                <Button
                  size="default"
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white w-full sm:w-auto md:w-32 font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                  onClick={handleRedirectBack}
                >
                  <LucideArrowLeft size={18} /> Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default UrgentNotification;
