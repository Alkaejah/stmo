import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import Dashboard from "@/module/TreasurerModule/Dashboard";
import React from "react";

const TreasurerDashboardPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <Dashboard />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default TreasurerDashboardPage;
