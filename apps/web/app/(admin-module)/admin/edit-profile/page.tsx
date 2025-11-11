import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import EditProfile from "@/module/AdminModule/EditProfile";
import React from "react";

const AdminEditProfilePage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <EditProfile />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default AdminEditProfilePage;
