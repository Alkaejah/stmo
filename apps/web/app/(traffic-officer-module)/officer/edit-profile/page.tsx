import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import EditProfile from "@/module/TrafficOfficerModule/EditProfile";
import React from "react";

const OfficerEditProfilePage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <EditProfile />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default OfficerEditProfilePage;
