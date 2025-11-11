import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import SingleViewTicketHistory from "@/module/TrafficOfficerModule/TicketHistory/components/SingleViewTicketHistory";
import React from "react";

const OfficerTicketSingleViewHistoryPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <SingleViewTicketHistory />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default OfficerTicketSingleViewHistoryPage;
