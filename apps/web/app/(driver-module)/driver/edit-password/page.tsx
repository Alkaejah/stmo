import AuthGuard from "@/common/components/Wrappers/AuthGuard";
import UpdatePassword from "@/module/DriverModule/EditProfile/components/UpdatePassword";
import React from "react";

const DriverEditPasswordPage = () => {
  return (
    <div>
      <AuthGuard>
        <UpdatePassword />
      </AuthGuard>
    </div>
  );
};

export default DriverEditPasswordPage;
