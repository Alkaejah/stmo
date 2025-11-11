import AuthGuard from "@/common/components/Wrappers/AuthGuard";
import Dashboard from "@/module/DriverModule/Dashboard";
import React from "react";

const DriverDashboardPage = () => {
  return (
    <div>
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    </div>
  );
};

export default DriverDashboardPage;
