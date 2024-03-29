import { ItemStatus } from "@prisma/client";
import { create } from "zustand";

export interface ItemListState {
    activeStatus: ItemStatus;
    isMultiselect: boolean;
    isShowPanel: boolean;
    selectedItems: Set<string>;
    includedTags: Set<string>;
    excludedTags: Set<string>;
}

export interface ItemListActions {
    setActiveStatus: (activeStatus: ItemStatus) => void;
    setIncludedTags: (includedTags: Set<string>) => void;
    setExcludedTags: (excludedTags: Set<string>) => void;
    enableMultiselect: () => void;
    disableMultiselect: () => void;
    selectItem: (id: string) => void;
    showPanel: () => void;
    dismissPanel: () => void;
    reset: () => void;
}

const initialState: ItemListState = {
    activeStatus: ItemStatus.Inbox,
    isMultiselect: false,
    isShowPanel: false,
    selectedItems: new Set(),
    includedTags: new Set(),
    excludedTags: new Set(),
};

export const useItemListStore = create<ItemListState & ItemListActions>(
    (set) => ({
        ...initialState,

        setActiveStatus: (activeStatus) => set({ activeStatus }),
        setIncludedTags: (includedTags) => set({ includedTags }),
        setExcludedTags: (excludedTags) => set({ excludedTags }),

        enableMultiselect: () => set({ isMultiselect: true }),
        disableMultiselect: () =>
            set({
                isShowPanel: false,
                selectedItems: new Set(),
                isMultiselect: false,
            }),

        selectItem: (id) =>
            set((state) => {
                if (state.isMultiselect) {
                    const next = new Set(state.selectedItems);
                    if (next.has(id)) {
                        next.delete(id);
                    } else {
                        next.add(id);
                    }
                    return { selectedItems: next };
                } else {
                    return { selectedItems: new Set([id]), isShowPanel: true };
                }
            }),

        showPanel: () => set({ isShowPanel: true }),
        dismissPanel: () => set({ isShowPanel: false }),

        reset: () => set(initialState),
    }),
);
