import AuthGuard from "@/common/components/Wrappers/AuthGuard";
import SIngleViewTicket from "@/module/DriverModule/RecordsOfViolations/components/SIngleViewTicket";
import React from "react";

const DriverRecordsOfViolationPage = () => {
  return (
    <div>
      <AuthGuard>
        <SIngleViewTicket />
      </AuthGuard>
    </div>
  );
};

export default DriverRecordsOfViolationPage;
