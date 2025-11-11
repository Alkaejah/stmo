"use client";
import { Typography } from "@/common/components/ui/Typography";
import {
  LucideCalendarDays,
  LucideChevronDown,
  LucideContact,
  LucideCopy,
  LucideFileLineChart,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideMenu,
  LucideSettings,
  LucideSquarePen,
  LucideTicket,
  LucideUser,
  LucideUserCircle2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useNotificationStore from "@/module/DriverModule/Notifications/store/useNotificationStore";
import useBackOfficeSessionStore from "@/common/store/useBackOfficeSessionStore";
import toast from "react-hot-toast";
import useBackOfficerLogout from "@/common/hooks/BackOffice/useBackOfficerLogout";

type AdminSidebarProps = {
  children: React.ReactNode;
};

const AdminSidebar = ({ children }: AdminSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const session = useBackOfficeSessionStore((state) => state);
  const { mutateAsync: logout } = useBackOfficerLogout();
  const router = useRouter();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
  const profilePictureKey = session?.profilePicture?.[0]?.key;
  const profilePictureUrl = profilePictureKey
    ? `/assets/${profilePictureKey}`
    : null;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // State for toggling profile menu
  const toggleProfileMenu = () => setIsProfileMenuOpen((prev) => !prev); // Toggle function for profile menu
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    setIsLoggingOut(true); // Set loading state

    try {
      await logout(); // Call logout function
      setIsLoggingOut(false);
      router.push("/stmo/officers"); // Use Next.js router instead of `window.location.href`
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    console.log("🔄 Sidebar mounted, fetching latest unread count...");
    setUnreadCount(unreadCount); // Correct way to refresh Zustand
  }, []);

  console.log("session in sidebar: ", session);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } bg-primary text-white flex flex-col p-4 transition-all duration-300 ease-in-out`}
      >
        {/* Toggle Button */}
        <div
          className="flex justify-end hover:cursor-pointer hover:text-gray-300 transition ease-in-out"
          onClick={toggleSidebar}
        >
          <LucideMenu size={25} />
        </div>

        {/* Profile Section */}
        <div
          className={`flex flex-col items-center mb-6 pt-6 mt-4 transition-all duration-300 ${
            isSidebarOpen ? "gap-3" : "gap-2"
          }`}
        >
          {profilePictureUrl ? (
            <Image
              src={profilePictureUrl}
              alt="Profile Picture"
              width={isSidebarOpen ? 100 : 40}
              height={isSidebarOpen ? 100 : 40}
              className={`rounded-full object-cover aspect-square bg-gray-300 border-white-500 ${
                isSidebarOpen ? "border-4" : "border-2"
              }`}
            />
          ) : (
            <div
              className={`bg-gray-400 rounded-full flex items-center justify-center ${
                isSidebarOpen ? "w-20 h-20" : "w-10 h-10"
              }`}
            >
              <LucideUser
                className={`text-gray-500 ${
                  isSidebarOpen ? "w-12 h-12" : "w-8 h-8"
                }`}
              />
            </div>
          )}

          {isSidebarOpen && (
            <Typography className="text-lg font-semibold text-center leading-tight m-3">
              {session.username}{" "}
              <span className="text-xs text-center font-normal mt-1 flex items-center justify-center gap-1">
                {session.backOfficerControlNumber}
                <LucideCopy
                  className="w-3 h-3 items-center cursor-pointer text-gray-100 hover:text-gray-300 mb-0.5"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      session.backOfficerControlNumber || "",
                    );
                    toast.success("ECN copied!"); // Optional toast notification
                  }}
                />
              </span>
            </Typography>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-6 w-full">
          <button
            className={`flex ${
              isSidebarOpen
                ? "items-center gap-4"
                : "justify-center items-center"
            } text-lg`}
          >
            <LucideLayoutDashboard className="w-6 h-6 items-center" />
            {isSidebarOpen && (
              <Link href="/admin/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
            )}
          </button>
          {/* Edit Profile with Sub-Items */}
          <div>
            <div
              className={`flex ${
                isSidebarOpen
                  ? "items-center justify-between"
                  : "justify-center items-center"
              } text-lg cursor-pointer hover:text-gray-300 transition`}
              onClick={toggleProfileMenu}
            >
              <div className="flex items-center gap-4">
                <LucideUserCircle2 className="w-6 h-6" />
                {isSidebarOpen && <span>Edit Profile</span>}
              </div>
              {isSidebarOpen && (
                <LucideChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isProfileMenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </div>

            {/* Sub-Items with Smooth Expand Animation */}
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                isProfileMenuOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              {isSidebarOpen && (
                <div className="ml-12 mt-2 flex flex-col gap-2 text-sm">
                  <Link
                    href="/admin/edit-profile"
                    className="hover:text-gray-300"
                  >
                    Personal Information
                  </Link>
                  <Link
                    href="/admin/edit-password"
                    className="hover:text-gray-300"
                  >
                    Password
                  </Link>
                </div>
              )}
            </div>
          </div>
          <button
            className={`flex ${
              isSidebarOpen
                ? "items-center gap-4"
                : "justify-center items-center"
            } text-lg`}
          >
            <LucideSquarePen className="w-6 h-6 items-center" />
            {isSidebarOpen && (
              <Link
                href="/admin/officer-evaluation"
                className="hover:text-gray-300"
              >
                Officer's Evaluation
              </Link>
            )}
          </button>

          {/* Settings with Sub-Items */}
          <div>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex justify-between items-center w-full text-lg`}
            >
              <div
                className={`flex items-center ${isSidebarOpen ? "gap-4" : "justify-center w-full"}`}
              >
                <LucideSettings className="w-6 h-6" />
                {isSidebarOpen && <span>Settings</span>}
              </div>
              {isSidebarOpen && (
                <LucideChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isSettingsOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </button>

            {/* Sub-Items with Smooth Expand Animation */}
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                isSettingsOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              {isSidebarOpen && (
                <div className="ml-12 mt-2 flex flex-col gap-2 text-sm">
                  <Link
                    href="/admin/settings/setup-violations"
                    className="hover:text-gray-300"
                  >
                    Setup Violations
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Other Menu Items */}
          <button
            className={`flex ${
              isSidebarOpen
                ? "items-center gap-4"
                : "justify-center items-center"
            } text-lg`}
          >
            <LucideContact className="w-6 h-6 items-center" />
            {isSidebarOpen && (
              <Link href="/admin/accounts" className="hover:text-gray-300">
                User Accounts
              </Link>
            )}
          </button>

          <button
            className={`flex items-center justify-center ${
              isSidebarOpen ? "gap-4" : "w-full"
            } text-lg`}
          >
            <LucideCalendarDays className="w-6 h-6" />
            {isSidebarOpen && (
              <Link
                href="/admin/manage-apprehension-officer-schedule"
                className="hover:text-gray-300 text-left"
              >
                Manage Apprehension Officers Schedule
              </Link>
            )}
          </button>
          <button
            className={`flex ${
              isSidebarOpen
                ? "items-center gap-4"
                : "justify-center items-center"
            } text-lg`}
          >
            <LucideTicket className="w-6 h-6" />
            {isSidebarOpen && (
              <Link
                href="/admin/tickets"
                className="hover:text-gray-300 text-left"
              >
                Tickets
              </Link>
            )}
          </button>

          <button
            className={`flex ${
              isSidebarOpen
                ? "items-center gap-4"
                : "justify-center items-center"
            } text-lg`}
          >
            <LucideFileLineChart className="w-6 h-6 items-center" />
            {isSidebarOpen && (
              <Link href="/admin/reports" className="hover:text-gray-300">
                Reports
              </Link>
            )}
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex ${
              isSidebarOpen
                ? "items-center gap-4"
                : "justify-center items-center"
            } text-lg ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <LucideLogOut className="w-6 h-6" />
            {isSidebarOpen && (
              <span className="hover:text-gray-300">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100">{children}</div>
    </div>
  );
};

export default AdminSidebar;
