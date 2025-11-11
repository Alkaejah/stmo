import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import UpdatePassword from "@/module/TrafficOfficerModule/EditProfile/components/UpdatePassword";
import React from "react";

const OfficerEditPasswordPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <UpdatePassword />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default OfficerEditPasswordPage;
