import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import GenerateReceiptPreview from "@/module/TreasurerModule/TransactionHistory/components/GenerateRecieptPreview";
import React from "react";

const TreasurerReceiptSingleViewPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <GenerateReceiptPreview />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default TreasurerReceiptSingleViewPage;
