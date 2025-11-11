"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useGetReceiptById from "@/common/hooks/Treasurers/useGetReceiptById";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { LucidePrinter } from "lucide-react";
import { Spinner } from "@/common/components/ui/Spinner";

const GenerateReceiptPreview = () => {
  const params = useParams<{ ticketId: string }>();
  const ticketId = params.ticketId;
  const { data: getTicketData, isPending } = useGetReceiptById(ticketId);
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

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      const printContents = printRef.current.innerHTML;

      const printStyles = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("");
          } catch (e) {
            console.warn("Unable to access stylesheet", e);
            return "";
          }
        })
        .join("");

      printWindow?.document.write(`
        <html>
          <head>
            <title>Print Receipt</title>
            <style>
              ${printStyles}
  
              /* ✅ Ensure correct A4 portrait format */
              @page {
                size: A4 portrait;
                margin: 0;
              }
  
              @media print {
                .non-printable {
                  display: none !important;
                }
  
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: none;
                  transform: scale(1);
                }
  
                /* ✅ Ensure receipt container scales correctly */
                .receipt-container {
                  width: 100%;
                  max-width: 800px;
                  height: auto;
                  overflow: hidden;
                  padding: 0;
                  margin: 0;
                }
  
                /* ✅ Keep text scaling proportional */
                .data-overlay {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                  display: flex;
                  flex-direction: column;
                  font-size: 12pt;
                  color: black;
                  background: none !important;
                }
                /* ✅ Citation Fee Control */
              .citation-fee {
                position: absolute;
                top: 40%; /* Adjust to move up/down */
                left: 33%; /* Adjust to move left/right */
                font-size: 12pt;
                font-weight: bold;
                }
                /* ✅ Adjust alignment for Date */
                .receipt-date {
                  position: absolute;
                  top: 22%;
                  left: 37%;
                  font-size: 12pt;
                }
  
                /* ✅ Agency */
                .agency {
                  position: absolute;
                  top: 27%;
                  left: 37%;
                  font-size: 12pt;
                }
  
                /* ✅ Payor Name */
                .payor-name {
                  position: absolute;
                  top: 30%;
                  left: 37%;
                  font-size: 12pt;
                }
  
             .violations-container {
                position: absolute;
                top: 45%;
                left: auto;  /* Remove left positioning */
                right: 17%;   /* Adjusted to move closer to the right */
                width: 50%;  /* Adjust width to prevent overflow */
                font-size: 12pt;
              }
                /* ✅ Prevent truncation of Amount in Words */
                .amount-in-words {
                  position: absolute;
                  width: 80%;
                  left: 10%;
                  bottom: 26%;
                  white-space: normal;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  text-align: center;
                  font-size: 12pt;
                }
  
                /* ✅ Fix Collecting Officer Name Alignment */
                .collecting-officer {
                  position: absolute;
                  right: 30%;
                  bottom: 8%;
                  white-space: nowrap;
                  text-align: right;
                  padding-right: 20px;
                  font-size: 12pt;
                }
  
                /* ✅ Adjust Total Amount */
                .total-amount {
                  position: absolute;
                  bottom: 32%;
                  right: 33%;
                  font-size: 12pt;
                  font-weight: bold;
                }
              }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              ${printContents}
            </div>
          </body>
        </html>
      `);

      printWindow?.document.close();
      printWindow?.focus();

      setTimeout(() => {
        printWindow?.print();
        printWindow?.close();
      }, 500);
    }
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
  // Only modify the violations mapping logic (look for the ✅ emoji)
  const violations = [
    ...item.natureOfCollection.violations.map((violation: any) => ({
      violationCategoryName:
        violation.violationId.violationCategory.violationCategoryName,
      violationCode: violation.violationId.violationCode,
      violationDescription: violation.violationId.violationDescription,
      penalty: violation.penaltyId.penalty,
    })),
    // ✅ Only change: Add penalty mapping for otherViolations
    ...item.natureOfCollection.otherViolations.map((otherViolation: any) => ({
      violationDescription: otherViolation.violationDescription,
      penalty: otherViolation.penaltyId.penalty, // This fixes the N/A issue
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
              {/* ✅ Print Button (Top Right) */}
              <div className="non-printable">
                <Button
                  type="button"
                  className="absolute top-5 right-5 bg-secondary hover:bg-blue-300 text-white font-bold py-2 px-4 rounded flex gap-2 items-center"
                  onClick={handlePrint}
                >
                  <LucidePrinter size={15} />
                  Print
                </Button>
              </div>

              {/* Receipt Image */}
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

                {/* Data Overlay */}
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

export default GenerateReceiptPreview;
