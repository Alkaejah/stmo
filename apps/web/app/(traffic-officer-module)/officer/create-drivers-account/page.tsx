import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import CreateDriversAccount from "@/module/TrafficOfficerModule/CreateDriversAccount";
import React from "react";

const OfficerCreateDriversAccountPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <CreateDriversAccount />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default OfficerCreateDriversAccountPage;
