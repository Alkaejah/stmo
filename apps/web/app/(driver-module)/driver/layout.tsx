import "../../globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import GlobalWrappers from "@/common/components/Wrappers/GlobalWrappers";
import DriverSidebar from "@/module/DriverModule/components/DriverSidebar";

const inter = Inter({ subsets: ["latin"] });

export default function DriverLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <GlobalWrappers>
      <Toaster />
      <DriverSidebar>{children}</DriverSidebar>
    </GlobalWrappers>
  );
}
