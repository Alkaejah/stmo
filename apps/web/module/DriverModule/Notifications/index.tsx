"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import useGetAllNotifications from "@/common/hooks/Drivers/module/useGetAllNotifications";
import useReadNotificationById from "@/common/hooks/Drivers/module/useReadNotificationById";
import useNotificationStore from "./store/useNotificationStore";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";

const Notification = () => {
  const router = useRouter();
  const { data, isPending } = useGetAllNotifications();
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  const [selectedTab, setSelectedTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const [selectedNotificationCategory, setSelectedNotificationCategory] =
    useState<string | null>(null);
  const { mutateAsync: readNotification } = useReadNotificationById(
    selectedNotificationId ?? undefined,
  );

  useEffect(() => {
    if (data) {
      const unread =
        data.items?.filter((notification: any) => !notification.isRead)
          .length || 0;
      setUnreadCount(unread);
    }
  }, [data]);

  useEffect(() => {
    if (selectedNotificationId) {
      readNotification().catch((error) =>
        console.error("Failed to mark notification as read:", error),
      );
    }
  }, [selectedNotificationId]);

  const notificationItem = (data?.items || []).sort(
    (a: any, b: any) => Number(a.isRead) - Number(b.isRead),
  );

  const tabCount = {
    WC: notificationItem.filter((n: any) => n.category === "WC" && !n.isRead)
      .length,
    AR: notificationItem.filter((n: any) => n.category === "AR" && !n.isRead)
      .length,
    UR: notificationItem.filter((n: any) => n.category === "UR" && !n.isRead)
      .length,
    PC: notificationItem.filter((n: any) => n.category === "PC" && !n.isRead)
      .length,
    ALL: notificationItem.filter((n: any) => !n.isRead).length,
  };

  const TABS = [
    { label: "All", category: "ALL", color: "bg-gray-500" },
    { label: "Welcome", category: "WC", color: "bg-green-600" },
    { label: "Action Required", category: "AR", color: "bg-orange-500" },
    { label: "Urgent", category: "UR", color: "bg-red-600" },
    { label: "Payment", category: "PC", color: "bg-blue-600" },
  ];

  const handleNotificationClick = (
    notificationId: string,
    notificationCategory: string,
  ) => {
    setSelectedNotificationId(notificationId);
    setSelectedNotificationCategory(notificationCategory);

    let redirectUrl = `/driver/notification`;
    switch (notificationCategory) {
      case "WC":
        redirectUrl = `/driver/notification/read-notification/${notificationId}/welcome-notification`;
        break;
      case "AR":
        redirectUrl = `/driver/notification/read-notification/${notificationId}/action-required`;
        break;
      case "PC":
        redirectUrl = `/driver/notification/read-notification/${notificationId}/payment-confirmation`;
        break;
      case "UR":
        redirectUrl = `/driver/notification/read-notification/${notificationId}/urgent-notification`;
        break;
    }

    router.push(redirectUrl);
  };

  // Pagination logic
  const itemsPerPage = 20;
  const filteredItems =
    selectedTab === "ALL"
      ? notificationItem
      : notificationItem.filter((item: any) => item.category === selectedTab);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return (
    <WidthWrapper width="full">
      <div className="relative w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 sm:px-6 md:px-8 lg:px-10 py-8">
        <div className="relative z-10 w-full max-w-full h-[90vh] bg-white bg-opacity-90 shadow-2xl rounded-xl flex flex-col p-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            Notifications{" "}
            {tabCount.ALL > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full">
                {tabCount.ALL}
              </span>
            )}
          </h2>

          {/* Tabs and pagination header */}
          <div className="w-full flex justify-between items-center border-b border-gray-200 mb-4 px-2 overflow-x-auto">
            {/* Tabs */}
            <div className="flex gap-4">
              {TABS.map((tab) => {
                const isActive = selectedTab === tab.category;
                const count = tabCount[tab.category as keyof typeof tabCount];
                return (
                  <button
                    key={tab.category}
                    onClick={() => {
                      setSelectedTab(tab.category);
                      setCurrentPage(1);
                    }}
                    className={`relative py-2 px-4 font-medium text-sm whitespace-nowrap rounded-t-md transition-all
                      ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-black"}
                    `}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={`ml-2 px-2 py-0.5 text-xs font-bold text-white rounded-full ${tab.color}`}
                      >
                        {count} new
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>
                {startIndex + 1}–{Math.min(endIndex, filteredItems.length)} of{" "}
                {filteredItems.length}
              </span>
              <button
                onClick={() =>
                  currentPage > 1 && setCurrentPage((prev) => prev - 1)
                }
                className="px-2 py-1 hover:bg-gray-200 rounded disabled:opacity-50"
                disabled={currentPage === 1}
              >
                <LucideChevronLeft />
              </button>
              <button
                onClick={() =>
                  endIndex < filteredItems.length &&
                  setCurrentPage((prev) => prev + 1)
                }
                className="px-2 py-1 hover:bg-gray-200 rounded disabled:opacity-50"
                disabled={endIndex >= filteredItems.length}
              >
                <LucideChevronRight />
              </button>
            </div>
          </div>

          {/* Scrollable Notification List */}
          {isPending ? (
            <div className="text-gray-500 mt-4">Loading...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-gray-500 mt-4">No notifications.</div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <ul className="w-full divide-y divide-gray-200 pr-1">
                {paginatedItems.map((notification: any) => {
                  const notificationId = notification.id || notification._id;
                  const notificationCategory = notification.category;
                  const isRead = notification.isRead;
                  const subject =
                    notification.subject || "Unnamed Notification";
                  const driverName = `${notification?.driver?.firstName || ""} ${notification?.driver?.lastName || ""}`;
                  const createdAt = notification?.createdAt;
                  const formattedDate = createdAt
                    ? format(parseISO(createdAt), "MMM dd")
                    : "";

                  let message = "";
                  switch (notificationCategory) {
                    case "AR":
                      message = `Dear ${driverName}, We would like to inform you that a ticket violation has been issued under your name. Please review and confirm the details of the ticket to proceed further.`;
                      break;
                    case "UR":
                      message = `Dear ${driverName}, We are writing to notify you that your ticket violation has exceeded the 72-hours confirmation and payment window. Immediate action is required to resolve this matter and avoid additional penalties.`;
                      break;
                    case "PC":
                      message = `Dear ${driverName}, We are pleased to confirm that your payment for the violation has been successfully processed.`;
                      break;
                    case "WC":
                      message = `Hi ${driverName}, This is your Driver Control Number: ${notification.content || "N/A"}`;
                      break;
                    default:
                      message =
                        notification.content || "No additional content.";
                  }

                  return (
                    <li
                      key={notificationId}
                      onClick={() =>
                        handleNotificationClick(
                          notificationId,
                          notificationCategory,
                        )
                      }
                      className={`w-full px-4 py-3 flex justify-between items-start cursor-pointer transition duration-200 ${
                        isRead ? "bg-white" : "bg-gray-100"
                      } hover:bg-gray-200`}
                    >
                      <div className="w-full flex items-start justify-between gap-4">
                        <div className="flex-1 text-sm text-black truncate">
                          <span
                            className={`${isRead ? "text-gray-800" : "font-semibold"}`}
                          >
                            {subject}:
                          </span>{" "}
                          <span className="text-gray-500 truncate">
                            {message}
                          </span>
                        </div>
                        <div className="flex-shrink-0 min-w-[60px] text-xs text-right">
                          <span
                            className={`${isRead ? "text-gray-500" : "text-black font-semibold"}`}
                          >
                            {formattedDate}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </WidthWrapper>
  );
};

export default Notification;
