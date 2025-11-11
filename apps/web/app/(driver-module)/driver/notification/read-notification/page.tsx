import AuthGuard from "@/common/components/Wrappers/AuthGuard";
import ReadNotification from "@/module/DriverModule/Notifications/components/ReadNotification";
import React from "react";

const DriverReadNotificationPage = () => {
  return (
    <div>
      <AuthGuard>
        <ReadNotification />
      </AuthGuard>
    </div>
  );
};

export default DriverReadNotificationPage;
