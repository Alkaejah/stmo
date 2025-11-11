import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import AddTicketPhotos from "@/module/TrafficOfficerModule/AddViolationTicket/components/AddTicketPhotos";
import React from "react";

const OfficerAddTicketPhotosPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <AddTicketPhotos />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default OfficerAddTicketPhotosPage;
