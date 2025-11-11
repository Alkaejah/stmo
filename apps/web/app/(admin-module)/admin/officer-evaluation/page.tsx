import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import Evaluation from "@/module/AdminModule/Evaluation";
import React from "react";

const AdminOfficerEvaulationPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <Evaluation />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default AdminOfficerEvaulationPage;
