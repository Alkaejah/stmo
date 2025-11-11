import { create } from "zustand";
import { T_Session } from "@repo/contract";

type T_Session_Action = {
  update: (session: T_Session) => void;
  remove: () => void;
};

const useDriverSessionStore = create<T_Session & T_Session_Action>((set) => ({
  isDriver: false,
  id: null,
  profilePicture: null,
  username: null,
  deactivated: null,
  changePasswordAt: null,
  role: null,
  driverControlNumber: null,

  // Prevent unnecessary updates
  update: (session: T_Session) =>
    set((state) => {
      const isStateDifferent =
        JSON.stringify(state) !== JSON.stringify(session);
      if (isStateDifferent) {
        return { ...state, ...session };
      }
      return state;
    }),

  remove: () =>
    set({
      driverControlNumber: null,
      isDriver: false,
      id: null,
      profilePicture: null,
      username: null,
      deactivated: null,
      changePasswordAt: null,
      role: null,
    }),
}));

export default useDriverSessionStore;
