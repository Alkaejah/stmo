import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import Dashboard from "@/module/AdminModule/Dashboard";
import React from "react";

const AdminDashboardPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <Dashboard />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default AdminDashboardPage;
