import BackOfficeAuthGuard from "@/common/components/BackOfficeWrappers/BackOfficeAuthGuard";
import TreasurerGenerateReceipt from "@/module/TreasurerModule/GenerateReceipt";
import React from "react";

const TreasurerGenerateReceiptPage = () => {
  return (
    <div>
      <BackOfficeAuthGuard>
        <TreasurerGenerateReceipt />
      </BackOfficeAuthGuard>
    </div>
  );
};

export default TreasurerGenerateReceiptPage;
