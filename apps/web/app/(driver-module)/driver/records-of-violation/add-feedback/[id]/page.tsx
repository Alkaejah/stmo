import AuthGuard from "@/common/components/Wrappers/AuthGuard";
import FeedbackForm from "@/module/DriverModule/RecordsOfViolations/components/FeedbackForm";
import React from "react";

const DriverAddFeedBackPage = () => {
  return (
    <div>
      <AuthGuard>
        <FeedbackForm />
      </AuthGuard>
    </div>
  );
};

export default DriverAddFeedBackPage;
