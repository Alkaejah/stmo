import AuthGuard from "@/common/components/Wrappers/AuthGuard";
import SingleViewReceipt from "@/module/DriverModule/RecordsOfViolations/components/SingleViewReceipt";
import React from "react";

const DriverRecordsOfViolationPage = () => {
  return (
    <div>
      <AuthGuard>
        <SingleViewReceipt />
      </AuthGuard>
    </div>
  );
};

export default DriverRecordsOfViolationPage;
