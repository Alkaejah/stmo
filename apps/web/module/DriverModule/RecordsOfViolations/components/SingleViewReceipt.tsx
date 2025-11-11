"use client";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";

import { Spinner } from "@/common/components/ui/Spinner";
import useGetReceiptById from "@/common/hooks/Drivers/module/useGetReceiptById";

const SingleViewReceipt = () => {
  const params = useParams<{ receiptId: string }>();
  const receiptId = params.receiptId;
  const { data: getTicketData, isPending } = useGetReceiptById(receiptId);
  const printRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "";
    if (typeof date === "string") {
      return format(parseISO(date), "MM/dd/yyyy");
    }
    if (date instanceof Date) {
      return format(date, "MM/dd/yyyy");
    }
    return "";
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner variant="primary">Loading data...</Spinner>
      </div>
    );
  }

  if (!getTicketData?.item) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No data found
      </div>
    );
  }

  const { item } = getTicketData;
  const payorName = `${item.payor.firstName} ${item.payor.lastName}`;
  const date = item.createdAt;
  const agency = item.agency;
  const totalAmount = item.total;
  const amountInWords = item.amountInWords;
  const collectorsName = `${item.collectingOfficer.firstName} ${item.collectingOfficer.lastName}`;

  const violations = [
    ...item.natureOfCollection.violations.map((violation: any) => ({
      violationCategoryName:
        violation.violationId.violationCategory.violationCategoryName,
      violationCode: violation.violationId.violationCode,
      violationDescription: violation.violationId.violationDescription,
      penalty: violation.penaltyId.penalty,
    })),
    ...item.natureOfCollection.otherViolations.map((otherViolation: any) => ({
      violationDescription: otherViolation.violationDescription,
      penalty: otherViolation.penaltyId.penalty,
    })),
  ];

  return (
    <WidthWrapper width="full">
      <div className="bg-[url('/Aerial_Shot.png')] bg-cover bg-center w-full min-h-screen flex justify-center items-center">
        <div className="sm:p-2 md:p-8 w-full flex justify-center">
          <div className="bg-primary bg-opacity-80 rounded-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-3/4 max-w-4xl mx-auto min-h-[90vh] sm:px-8 md:px-32 shadow-lg flex flex-col justify-center relative">
            <div
              ref={printRef}
              className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-2xl mx-auto relative"
            >
              {/* Receipt Image and Data Overlay */}
              <div className="receipt-container flex justify-center mx-auto relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <Spinner variant="primary">Loading...</Spinner>
                  </div>
                )}
                <Image
                  src={`/receipt.png`}
                  alt="Receipt image"
                  width={400}
                  height={750}
                  className="object-fit"
                  loading="lazy"
                  onLoadingComplete={() => setImageLoaded(true)}
                />
                {imageLoaded && (
                  <div className="data-overlay absolute inset-0 flex flex-col text-black px-12 py-8 font-times-new-roman">
                    <div className="receipt-date absolute top-[22%] left-[26%] text-sm">
                      {formatDate(date)}
                    </div>
                    <div className="agency absolute top-[26.5%] left-[32%] text-sm">
                      {agency}
                    </div>
                    <div className="payor-name absolute top-[30%] left-[32%] text-sm">
                      {payorName}
                    </div>
                    <div className="citation-fee absolute top-[37%] left-[25%] text-sm font-semibold">
                      Citation Fee
                    </div>

                    {/* Violations List */}
                    <div className="violations-container absolute top-[45%] left-[23%] text-xs leading-tight w-[80%]">
                      <div className="grid grid-cols-2 gap-x-6 w-full max-w-[300px]">
                        {violations.map((violation: any, index) => (
                          <React.Fragment key={index}>
                            <p className="text-xs break-words w-full">
                              {violation.violationDescription || "N/A"}
                            </p>
                            <p className="text-xs pl-14 font-semibold text-center w-full">
                              {violation.penalty
                                ? `${violation.penalty}`
                                : "N/A"}
                            </p>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="total-amount absolute bottom-[32.5%] right-[26%] text-sm font-semibold">
                      {totalAmount}
                    </div>

                    {/* Amount in Words */}
                    <div className="amount-in-words absolute bottom-[27%] right-[16%] text-sm w-[60%] truncate">
                      {amountInWords}
                    </div>
                    <div className="collecting-officer absolute bottom-[8%] right-[27%] text-sm ">
                      {collectorsName}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default SingleViewReceipt;
