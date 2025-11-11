import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import Scheduling from "@/module/AdminModule/Scheduling/components/Scheduling";
import React from "react";

const AdminEditProfilePage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <Scheduling />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default AdminEditProfilePage;
