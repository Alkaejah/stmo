/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { T_Back_Office_Session } from "@repo/contract";

type T_Back_Office_Session_Action = {
  update: (backOfficeSession: T_Back_Office_Session) => void;
  remove: () => void;
};

const useBackOfficeSessionStore = create<
  T_Back_Office_Session & T_Back_Office_Session_Action
>((set) => ({
  isBackOfficer: false,
  id: null,
  profilePicture: null,
  username: null,
  deactivated: null,
  changePasswordAt: null,
  role: null,
  backOfficerControlNumber: null,
  update: (backOfficeSession: T_Back_Office_Session) =>
    set(() => ({ ...backOfficeSession })),
  remove: () =>
    set({
      backOfficerControlNumber: null,
      isBackOfficer: false,
      profilePicture: null,
      id: null,
      username: null,
      deactivated: null,
      changePasswordAt: null,
      role: null,
    }),
}));

export default useBackOfficeSessionStore;
