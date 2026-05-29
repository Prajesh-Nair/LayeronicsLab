import { create } from "zustand";

type AdminState = {
  authed: boolean;
  authChecked: boolean;
  setAuthed: (authed: boolean) => void;
  setAuthChecked: (checked: boolean) => void;
};

export const useAdmin = create<AdminState>()((set) => ({
  authed: false,
  authChecked: false,
  setAuthed: (authed) => set({ authed }),
  setAuthChecked: (authChecked) => set({ authChecked }),
}));
