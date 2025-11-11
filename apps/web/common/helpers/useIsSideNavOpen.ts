import { create } from "zustand";

type T_Side_Nav_Action = {
  isOpen: boolean;
  setIsOpen: () => void;
};
const useIsSideNavOpen = create<T_Side_Nav_Action>((set) => ({
  isOpen: false,
  setIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
export default useIsSideNavOpen;
