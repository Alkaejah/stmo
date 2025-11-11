import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import EditProfile from "@/module/TreasurerModule/EditProfile";
import React from "react";

const TreasurerEditProfilePage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <EditProfile />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default TreasurerEditProfilePage;
