import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import UpdatePassword from "@/module/AdminModule/EditProfile/components/UpdatePassword";
import React from "react";

const AdminEditPasswordPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <UpdatePassword />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default AdminEditPasswordPage;
