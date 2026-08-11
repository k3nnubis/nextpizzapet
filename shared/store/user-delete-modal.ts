import { create } from "zustand";

interface State {
  open: boolean;
  userId: number | undefined;
  openModal: (userId: number) => void;
  closeModal: () => void;
}

export const useUserModalStore = create<State>()((set) => ({
  open: false,
  userId: undefined,
  openModal: (userId: number) => set({ open: true, userId }),
  closeModal: () => set({ open: false, userId: undefined }),
}));
