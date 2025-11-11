"use client";

import { useState, useEffect } from "react";
import { Typography } from "@/common/components/ui/Typography";
import Image from "next/image";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import {
  LucideBarChartHorizontal,
  LucideCar,
  LucideCctv,
  LucideGavel,
  LucideMapPinned,
  LucideScale,
  LucideSiren,
} from "lucide-react";
import { Button } from "@/common/components/shadcn/ui/button";
import DriverAccountsTable from "../Accounts/components/DriverAccountsTable";
import OfficersAccountsTable from "../Accounts/components/officersAccounts";
import PenaltyTable from "./components/penalties";
import ViolationCategoryTable from "./components/violationCategory";
import ViolationTable from "./components/violations";
import ViolationAddressTable from "./components/violationAddress";

const Settings = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeTable, setActiveTable] = useState<
    "penalty" | "violation category" | "violations" | "violation address"
  >("penalty");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <WidthWrapper width="full">
      <div className="w-full min-h-screen flex justify-center items-center p-8 bg-[url('/Aerial_Shot.png')] bg-cover bg-center">
        <div className="bg-primary bg-opacity-80 shadow-lg rounded-lg p-10 max-w-7xl">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full">
            {/* Map Section */}
            <div className="flex justify-center items-center mb-4">
              {/* Toggle Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={activeTable === "penalty" ? "secondary" : "outline"}
                  onClick={() => setActiveTable("penalty")}
                  aria-label="View Drivers"
                  className="flex-1"
                >
                  <LucideScale className="w-4 h-4 mr-2" />
                  Penalty
                </Button>
                <Button
                  variant={
                    activeTable === "violation category"
                      ? "secondary"
                      : "outline"
                  }
                  onClick={() => setActiveTable("violation category")}
                  aria-label="View Officers"
                  className="flex-1"
                >
                  <LucideBarChartHorizontal className="w-4 h-4 mr-2" />
                  Violation Category
                </Button>
                <Button
                  variant={
                    activeTable === "violations" ? "secondary" : "outline"
                  }
                  onClick={() => setActiveTable("violations")}
                  aria-label="View Officers"
                  className="flex-1"
                >
                  <LucideGavel className="w-4 h-4 mr-2" />
                  Violations
                </Button>
                <Button
                  variant={
                    activeTable === "violation address"
                      ? "secondary"
                      : "outline"
                  }
                  onClick={() => setActiveTable("violation address")}
                  aria-label="View Officers"
                  className="flex-1"
                >
                  <LucideMapPinned className="w-4 h-4 mr-2" />
                  Violation Address
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 py-4 px-2 md:py-6 md:px-4 rounded-md shadow-md flex-grow">
              {/* Table Display */}
              <div className="flex-grow w-full mt-4">
                {activeTable === "penalty" ? (
                  <div className="flex flex-col rounded-lg w-full">
                    <PenaltyTable />
                  </div>
                ) : activeTable === "violation category" ? (
                  <div className="flex flex-col rounded-lg w-full">
                    <ViolationCategoryTable />
                  </div>
                ) : activeTable === "violations" ? (
                  <div className="flex flex-col rounded-lg w-full">
                    <ViolationTable />
                  </div>
                ) : activeTable === "violation address" ? (
                  <div className="flex flex-col rounded-lg w-full">
                    <ViolationAddressTable />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default Settings;
