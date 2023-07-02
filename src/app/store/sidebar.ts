import { create } from "zustand";

export interface SidebarState {
    isExpand: boolean;
    toggle: () => void;
    expand: () => void;
    collapse: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    isExpand: true,
    toggle: () => set((state) => ({ isExpand: !state.isExpand })),
    expand: () => set({ isExpand: true }),
    collapse: () => set({ isExpand: false }),
}));
