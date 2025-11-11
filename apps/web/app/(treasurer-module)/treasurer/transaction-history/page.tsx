import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import TransactionHistory from "@/module/TreasurerModule/TransactionHistory";
import React from "react";

const TreasurerTransactionHistoryPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <TransactionHistory />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default TreasurerTransactionHistoryPage;
