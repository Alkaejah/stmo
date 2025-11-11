import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import UpdatePassword from "@/module/TreasurerModule/EditProfile/components/UpdatePassword";
import React from "react";

const TreasurerEditPasswordPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <UpdatePassword />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default TreasurerEditPasswordPage;
