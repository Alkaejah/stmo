import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import TicketsForAdmin from "@/module/AdminModule/Tickets/Tickets";
import React from "react";

const AdminReportsPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <TicketsForAdmin />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default AdminReportsPage;
