import AuthGuard from "@/common/components/Wrappers/AuthGuard";
import RecordsOfViolations from "@/module/DriverModule/RecordsOfViolations";
import React from "react";

const DriverRecordsOfViolationPage = () => {
  return (
    <div>
      <AuthGuard>
        <RecordsOfViolations />
      </AuthGuard>
    </div>
  );
};

export default DriverRecordsOfViolationPage;
