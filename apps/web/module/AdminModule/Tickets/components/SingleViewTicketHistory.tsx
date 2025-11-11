"use client";
import React, { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/common/components/shadcn/ui/button";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { LucideArrowLeft } from "lucide-react";
import useGetTicketByIdForAdmin from "@/common/hooks/Admin/useGetTicketByIdForAdmin";

const SingleViewTicketHistory = () => {
  const param = useParams<{ ticketId: string }>();
  const ticketId = param.ticketId;
  const { data } = useGetTicketByIdForAdmin(ticketId);
  const router = useRouter();
  const printRef = useRef(null);

  const handleRedirectBack = () => {
    router.push(`/officer/ticket-history`);
  };

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "N/A";
    if (typeof date === "string") {
      return format(parseISO(date), "MMMM dd, yyyy");
    }
    if (date instanceof Date) {
      return format(date, "MM/dd/yyyy");
    }
    return "N/A";
  };

  const violationLocation = data?.item?.address
    ? `${data.item.address.street?._id || "Unknown Street"}, ${data.item.address.barangay?._id || "Unknown Barangay"}`
    : "Location Not Available";

  // Ensure address properties are safely accessed
  const address = data?.item?.driver?.address
    ? `${data.item.driver.address.street}, ${data.item.driver.address.barangay}, ${data.item.driver.address.municipality}, ${data.item.driver.address.province}`
    : "N/A";

  const formatTime = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    return format(parseISO(dateString), "hh:mm a"); // Formats as 12-hour AM/PM
  };
  const proofImages = data?.item?.proof?.map((p: { key: any }) => p.key) || [];
  console.log("Extracted proof keys:", proofImages);
  const eSignature =
    data?.item?.enforcerSignature?.map((p: { key: any }) => p.key) || [];
  console.log("Extracted enforcer signature keys:", eSignature);

  const citationData = {
    ticketNumber: data?.item?.ticketNumber || "N/A",
    licenseNumber: data?.item?.licenseNumber || "N/A",
    plateNumber: data?.item?.plateNumber || "N/A",
    lastName: data?.item?.driver?.lastName || "N/A",
    firstName: data?.item?.driver?.firstName || "N/A",
    middleName: data?.item?.driver?.middleName || "N/A",
    address,
    dateOfBirth: formatDate(data?.item?.driver?.dateOfBirth),
    violationDate: formatDate(data?.item?.createdAt),
    violationTime: formatTime(data?.item?.createdAt), // ✅ Fetching time dynamically
    location: violationLocation, // ✅ Updated this to dynamically fetch the location
    officer: `${data?.item?.enforcer?.firstName || "N/A"} ${
      data?.item?.enforcer?.lastName || "N/A"
    }`,
  };

  return (
    <WidthWrapper width="full">
      <div className="relative w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 sm:px-6 md:px-8 lg:px-8 md:py-8 lg:py-8">
        <div className="relative z-10 w-full max-w-full h-[90vh] bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14">
          <div
            ref={printRef}
            className="bg-white rounded-lg shadow-md p-4 sm:p-10 md:p-10 lg:p-10 w-full max-w-6xl mt-4"
          >
            {/* Header */}
            <div className="text-center">
              <Typography variant="h4" className="font-bold">
                TANGGAPAN NG PUNUMBAYAN
              </Typography>
              <Typography variant="h5" className="font-semibold">
                SINILOAN, LAGUNA
              </Typography>
            </div>

            {/* Citation Ticket Info */}
            <div className="mt-4 border-b border-gray-400 pb-2">
              <Typography variant="h4" className="font-bold mb-4">
                CITATION TICKET
              </Typography>
              <div className="flex flex-col md:flex-row md:justify-between md:gap-10 w-full">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 w-full">
                  {[
                    {
                      label: "TICKET NUMBER",
                      value: citationData.ticketNumber,
                    },
                    {
                      label: "LICENSE NUMBER",
                      value: citationData.licenseNumber,
                    },
                    {
                      label: "PLATE NUMBER",
                      value: citationData.plateNumber,
                    },
                    { label: "LAST NAME", value: citationData.lastName },
                    { label: "FIRST NAME", value: citationData.firstName },
                    {
                      label: "MIDDLE NAME",
                      value: citationData.middleName,
                    },
                    { label: "ADDRESS", value: citationData.address },
                    {
                      label: "DATE OF BIRTH",
                      value: citationData.dateOfBirth,
                    },
                  ].map((item, index) => (
                    <React.Fragment key={index}>
                      <Typography variant="h5" className="font-semibold">
                        {item.label}:
                      </Typography>
                      <Typography variant="h5" className="text-left">
                        {item.value}
                      </Typography>
                    </React.Fragment>
                  ))}
                </div>

                {proofImages.length > 0 ? (
                  proofImages.map(
                    (key: any, index: React.Key | null | undefined) =>
                      key ? (
                        <Image
                          key={index}
                          src={`/assets/${key}`} // Change this based on actual path
                          alt={`Violation Evidence`}
                          width={150}
                          height={100}
                          className="rounded-lg border border-gray-400 w-64 h-52 object-cover"
                          loading="lazy"
                        />
                      ) : null,
                  )
                ) : (
                  <p>No proof available</p>
                )}
              </div>
            </div>

            {/* Violation Details */}
            <div className="mt-4 border-b border-gray-400 pb-2">
              <Typography className="text-sm leading-relaxed">
                Magalang po naming ipinaabatid na sa ganap na{" "}
                <strong>{citationData.violationTime}</strong> ng{" "}
                <strong>{citationData.violationDate}</strong> na ikaw ay
                nagkaroon ng paglabag o hindi pagsunod sa Kautusang Bayan sa{" "}
                <strong>
                  {data?.item?.address?.street?.street || "Unknown Street"},{" "}
                  {data?.item?.address?.barangay?.barangay ||
                    "Unknown Barangay"}
                </strong>
                .
              </Typography>

              <Typography className="text-sm mt-2">
                Naaayon sa paglabag sa seksyon ____ ng Kautusang Bayan Bilang
                _____ Taong _____.
              </Typography>
              <Typography className="text-sm mt-2">
                At sa kadahilanang ito, ikaw ay inaatasang magtungo sa Tanggapan
                ng Ingat-Yaman upang bayaran ang multa sa loob ng 72 oras mula
                sa pagtanggap ng Citation Ticket na ito.
              </Typography>
            </div>

            {/* Violation and Fine Section */}
            <div className="mt-4 border-b border-gray-400 pb-2">
              <Typography className="text-sm font-semibold underline">
                PAGLABAG AT MULTA
              </Typography>

              {data?.item?.violations?.length > 0 ||
              data?.item?.otherViolations?.length > 0 ? (
                <>
                  {/* Render Violations */}
                  {data?.item?.violations.map((violation: any, index: any) => (
                    <div key={violation._id || index} className="mt-2">
                      <Typography className="text-sm">
                        <strong>
                          {violation.violationId?.violationCode}{" "}
                          {violation.violationId?.violationDescription}
                        </strong>{" "}
                        ({violation.penaltyId?.penaltyDescription} - ₱
                        {violation.penaltyId?.penalty}.00)
                      </Typography>
                    </div>
                  ))}

                  {/* Render Other Violations */}
                  {data?.item?.otherViolations.map(
                    (violation: any, index: any) => (
                      <div key={violation._id || index} className="mt-2">
                        <Typography className="text-sm">
                          <strong>
                            {violation.violationId?.violationCode}{" "}
                            {violation.violationDescription}
                          </strong>{" "}
                          ({violation.penaltyId?.penaltyDescription} - ₱
                          {violation.penaltyId?.penalty}.00)
                        </Typography>
                      </div>
                    ),
                  )}
                </>
              ) : (
                <Typography className="text-sm">
                  No violations recorded.
                </Typography>
              )}
            </div>

            {/* Officer Signature */}
            <div className="mt-6 text-center relative">
              {/* Signature positioned slightly higher */}
              <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 sm:w-full">
                {eSignature.length > 0 ? (
                  eSignature.map(
                    (key: any, index: React.Key | null | undefined) =>
                      key ? (
                        <Image
                          key={index}
                          src={`/assets/${key}`} // Change this based on actual path
                          alt={`Enforcer Signature`}
                          width={150}
                          height={100}
                          className=" w-40 h-20 object-cover"
                        />
                      ) : null,
                  )
                ) : (
                  <p>No signature available</p>
                )}
              </div>

              {/* Enforcer's Name */}
              <Typography className="text-sm font-semibold relative z-10">
                {citationData.officer}
              </Typography>

              {/* Underline directly below the enforcer name */}
              <div className="border-t border-black w-2/3 mx-auto mt-[-2px]"></div>

              {/* Description text below the underline */}
              <Typography className="text-xs mt-1">
                Pangalan at Lagda ng Tagapagpatupad na Opisyal
              </Typography>
            </div>

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
    </WidthWrapper>
  );
};

export default SingleViewTicketHistory;
