import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import Settings from "@/module/AdminModule/Settings";
import React from "react";

const AdminSettingsPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <Settings />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default AdminSettingsPage;
