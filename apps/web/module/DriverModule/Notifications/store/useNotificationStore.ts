import { create } from "zustand";
import { persist } from "zustand/middleware";

type NotificationStore = {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
};

const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      unreadCount: 0,
      setUnreadCount: (count) => set({ unreadCount: count }),
    }),
    {
      name: "notification-store", // ✅ Persist state in localStorage
    },
  ),
);

export default useNotificationStore;
