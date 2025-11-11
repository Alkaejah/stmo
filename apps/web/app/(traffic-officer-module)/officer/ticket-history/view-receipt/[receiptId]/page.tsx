import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import SingleViewReceipt from "@/module/TrafficOfficerModule/TicketHistory/components/SingleViewReceipt";
import React from "react";

const OfficerReceiptSingleViewPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <SingleViewReceipt />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default OfficerReceiptSingleViewPage;
