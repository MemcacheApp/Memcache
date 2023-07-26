import { create } from "zustand";

export interface TopbarState {
    isShow: boolean;
    setIsShow: (isShow: boolean) => void;
}

export const useTopbarStore = create<TopbarState>((set) => ({
    isShow: false,
    setIsShow: (isShow) => set({ isShow }),
}));
