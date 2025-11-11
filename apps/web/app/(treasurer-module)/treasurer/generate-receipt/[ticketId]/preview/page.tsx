import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import GenerateRecieptPreview from "@/module/TreasurerModule/GenerateReceipt/components/GenerateRecieptPreview";
import React from "react";

const TreasurerReceiptPreviewPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <GenerateRecieptPreview />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default TreasurerReceiptPreviewPage;
