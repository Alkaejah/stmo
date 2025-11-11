"use client";
import { Typography } from "@/common/components/ui/Typography";
import useDriverSessionStore from "@/common/store/useDriverSessionStore";
import {
  LucideBell,
  LucideChevronDown,
  LucideFileText,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideMenu,
  LucideUser,
  LucideUserCog,
  LucideCopy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import useNotificationStore from "../Notifications/store/useNotificationStore";
import useLogout from "@/common/hooks/Drivers/useLogout";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type DriverSidebarProps = {
  children: React.ReactNode;
};

const DriverSidebar = ({ children }: DriverSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const session = useDriverSessionStore((state) => state);
  const { mutateAsync: logout } = useLogout();
  const router = useRouter();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profilePictureKey = session?.profilePicture?.[0]?.key;
  const profilePictureUrl = profilePictureKey
    ? `/assets/${profilePictureKey}`
    : null;

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleProfileMenu = () => setIsProfileMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      setIsLoggingOut(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    setUnreadCount(unreadCount);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar with Smooth Toggle */}
      <div
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } flex-shrink-0 bg-primary text-white flex flex-col p-3 transition-all duration-300 ease-in-out h-full overflow-y-auto`}
      >
        {/* Sidebar Toggle Button */}
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
            <div className="text-center">
              <Typography className="text-lg font-semibold leading-tight">
                {session.username}
              </Typography>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Typography className="text-xs text-gray-200">
                  {session.driverControlNumber}
                </Typography>
                <LucideCopy
                  className="w-3 h-3 cursor-pointer hover:text-gray-300"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      session.driverControlNumber || "",
                    );
                    toast.success("DCN copied!");
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Menu Items */}
        <div className="flex flex-col gap-4 w-full">
          <button
            className={`flex ${
              isSidebarOpen
                ? "items-center gap-4"
                : "justify-center items-center"
            } text-lg`}
          >
            <LucideLayoutDashboard className="w-6 h-6" />
            {isSidebarOpen && <Link href="/driver/dashboard">Dashboard</Link>}
          </button>

          {/* Edit Profile Menu */}
          <div>
            <div
              className={`flex ${
                isSidebarOpen
                  ? "items-center justify-between"
                  : "justify-center"
              } text-lg cursor-pointer hover:text-gray-300 transition`}
              onClick={toggleProfileMenu}
            >
              <div className="flex items-center gap-3">
                <LucideUserCog className="w-6 h-6" />
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

            {/* Profile Submenu */}
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                isProfileMenuOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              {isSidebarOpen && (
                <div className="ml-10 mt-2 flex flex-col gap-2 text-sm">
                  <Link
                    href="/driver/edit-profile"
                    className="hover:text-gray-300"
                  >
                    Personal Information
                  </Link>
                  <Link
                    href="/driver/edit-password"
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
            <LucideFileText className="w-6 h-6" />
            {isSidebarOpen && (
              <Link href="/driver/records-of-violation">
                Record of Violations
              </Link>
            )}
          </button>

          <button
            className={`relative flex ${
              isSidebarOpen
                ? "items-center gap-4"
                : "justify-center items-center"
            } text-lg`}
          >
            <div className="relative">
              <LucideBell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            {isSidebarOpen && (
              <Link href="/driver/notification">Notification</Link>
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
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 overflow-y-auto">{children}</div>
    </div>
  );
};

export default DriverSidebar;
