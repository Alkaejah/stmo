"use client";

import { useState, useEffect } from "react";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { LucideCar, LucideSiren } from "lucide-react";
import { Button } from "@/common/components/shadcn/ui/button";
import DriverAccountsTable from "./components/DriverAccountsTable";
import OfficersAccountsTable from "./components/officersAccounts";

const Accounts = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeTable, setActiveTable] = useState<"drivers" | "officers">(
    "drivers",
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <WidthWrapper
      width="full"
      className="bg-[url('/Aerial_Shot.png')] bg-cover bg-center px-4 md:px-8 flex flex-col min-h-screen"
    >
      <div className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-6xl">
          {/* Title */}
          <Typography className="text-xl md:text-2xl lg:text-4xl font-bold text-white text-center mb-4">
            TRAFFIC VIOLATION MANAGEMENT SYSTEM
          </Typography>

          {/* Map Section */}
          <div className="bg-primary bg-opacity-80 py-4 px-2 md:py-6 md:px-4 rounded-md shadow-md flex-grow">
            <div className="flex justify-center items-center mb-4">
              {/* Toggle Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={activeTable === "drivers" ? "secondary" : "outline"}
                  onClick={() => setActiveTable("drivers")}
                  aria-label="View Drivers"
                  className="flex-1"
                >
                  <LucideCar className="w-4 h-4 mr-2" />
                  Drivers
                </Button>
                <Button
                  variant={activeTable === "officers" ? "secondary" : "outline"}
                  onClick={() => setActiveTable("officers")}
                  aria-label="View Officers"
                  className="flex-1"
                >
                  <LucideSiren className="w-4 h-4 mr-2" />
                  Officers
                </Button>
              </div>
            </div>

            {/* Table Display */}
            <div className="flex-grow w-full mt-4">
              {activeTable === "drivers" ? (
                <div className="flex flex-col rounded-lg w-full">
                  <DriverAccountsTable />
                </div>
              ) : (
                <div className="flex flex-col rounded-lg w-full">
                  <OfficersAccountsTable />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default Accounts;
