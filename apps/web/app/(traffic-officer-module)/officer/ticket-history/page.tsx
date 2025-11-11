import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import TicketHistory from "@/module/TrafficOfficerModule/TicketHistory";
import React from "react";

const OfficerTicketHistoryPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <TicketHistory />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default OfficerTicketHistoryPage;
