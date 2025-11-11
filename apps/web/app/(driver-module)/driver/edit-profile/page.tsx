import AuthGuard from "@/common/components/Wrappers/AuthGuard";
import EditProfile from "@/module/DriverModule/EditProfile";
import React from "react";

const DriverEditProfilePage = () => {
  return (
    <div>
      <AuthGuard>
        <EditProfile />
      </AuthGuard>
    </div>
  );
};

export default DriverEditProfilePage;
