import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import Accounts from "@/module/AdminModule/Accounts";
import React from "react";

const AdminAccountsPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <Accounts />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default AdminAccountsPage;
