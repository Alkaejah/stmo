import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import AddViolationTicket from "@/module/TrafficOfficerModule/AddViolationTicket";
import React from "react";

const OfficerAddViolationTicketPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <AddViolationTicket />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default OfficerAddViolationTicketPage;
