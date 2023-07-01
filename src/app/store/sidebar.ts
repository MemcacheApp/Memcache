import { create } from "zustand";

export interface SidebarState {
    isExpand: boolean;
    toggle: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    isExpand: true,
    toggle: () => set((state) => ({ isExpand: !state.isExpand })),
}));
