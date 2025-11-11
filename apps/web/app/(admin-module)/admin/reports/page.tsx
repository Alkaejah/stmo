import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import Reports from "@/module/AdminModule/Reports";
import React from "react";

const AdminReportsPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <Reports />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default AdminReportsPage;
