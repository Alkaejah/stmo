"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useConfirmTicketViolationById from "@/common/hooks/Drivers/module/useConfirmTicketViolationById";
import useGetNotificationById from "@/common/hooks/Drivers/module/useGetNotificationById";
import { format, parseISO } from "date-fns";
import { LucideArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import {
  IOtherViolationsPenalty,
  IViolationsPenalty,
} from "@/common/types/global";

const ActionRequiredNotification = () => {
  const params = useParams();
  const rawNotificationId = params.selectedNotificationId;
  const notificationId =
    typeof rawNotificationId === "string" ? rawNotificationId : undefined;

  const { data, isPending } = useGetNotificationById(notificationId);
  const { mutateAsync: confirmTicket, isPending: isConfirming } =
    useConfirmTicketViolationById(notificationId);
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

  const actionRequriedData = {
    subject: data?.item?.subject || "No Subject",
    name: data?.item?.driver.firstName + " " + data?.item?.driver.lastName,
    ticketNumber: data?.item?.ticket.ticketNumber || "N/A",
    violationDate: formatDate(data?.item?.createdAt),
    location: data?.item?.ticket?.address
      ? `${data?.item?.ticket?.address?.street?.street || "Unknown Street"}, ${data?.item?.ticket?.address?.barangay?.barangay || "Unknown Barangay"}`
      : "N/A",
    ticketStatus: data?.item?.ticket.ticketStatus || "Pending",
    totalPenalty,
  };

  return (
    <WidthWrapper width="full">
      <div className="relative w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 sm:px-6 md:px-8 lg:px-8 md:py-8 lg:py-8">
        <div className="relative z-10 w-full max-w-full h-[90vh] bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-14">
          <div className="flex">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl flex flex-col justify-between h-auto">
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
                {actionRequriedData.subject}
              </Typography>
              <Typography>
                Dear{" "}
                <span className="font-bold text-secondary">
                  {actionRequriedData.name}
                </span>
              </Typography>
              <Typography className="my-2">
                We would like to inform you that a ticket violation has been
                issued under your name. Please review and confirm the details of
                the ticket to proceed further.
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
                        {actionRequriedData.ticketNumber}
                      </span>
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Date of Violation:{" "}
                      <span className="font-bold text-secondary">
                        {actionRequriedData.violationDate}
                      </span>
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Location:{" "}
                      <span className="font-bold text-secondary">
                        {actionRequriedData.location}
                      </span>
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Total Fine/Penalty:{" "}
                      <span className="font-bold text-secondary">
                        ₱
                        {actionRequriedData.totalPenalty.toLocaleString(
                          "en-US",
                          { minimumFractionDigits: 2 },
                        )}
                      </span>
                    </Typography>
                  </li>
                </ul>
              </div>
              <Typography className="my-2">
                To confirm your ticket violation, please click the button below:
              </Typography>
              <div>
                <Button
                  size="default"
                  type="button"
                  onClick={async () => {
                    await confirmTicket();
                    router.push(`/driver/notification`);
                  }}
                  disabled={actionRequriedData.ticketStatus === "Confirmed"}
                  className={`${
                    actionRequriedData.ticketStatus === "Confirmed"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white w-full sm:w-auto md:w-32 font-bold py-2 px-4 rounded`}
                >
                  {actionRequriedData.ticketStatus === "Confirmed"
                    ? "Confirmed"
                    : "Confirm"}
                </Button>
                <Typography className="my-2">
                  Thank you for your prompt attention to this matter.
                </Typography>
              </div>
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

export default ActionRequiredNotification;
