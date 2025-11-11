import AuthGuard from "@/common/components/Wrappers/AuthGuard";
import Notifications from "@/module/DriverModule/Notifications";
import React from "react";

const DriverNotificationsPage = () => {
  return (
    <div>
      <AuthGuard>
        <Notifications />
      </AuthGuard>
    </div>
  );
};

export default DriverNotificationsPage;
