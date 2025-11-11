import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import FeedbackSummary from "@/module/AdminModule/Evaluation/component/FeedbackSummary";
import React from "react";

const AdminOfficerEvaluationSummaryPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <FeedbackSummary />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default AdminOfficerEvaluationSummaryPage;
