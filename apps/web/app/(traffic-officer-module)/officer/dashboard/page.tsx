import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import Dashboard from "@/module/TrafficOfficerModule/Dashboard";
import React from "react";

const OfficerDashboardPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <Dashboard />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default OfficerDashboardPage;
