import { create } from "zustand";
import { StatusEnum } from "../utils/Statuses";

export interface ItemListState {
    activeStatus: StatusEnum;
    isMultiselect: boolean;
    isShowPanel: boolean;
    selectedItems: Set<string>;
    includedTags: Set<string>;
    excludedTags: Set<string>;
    tagCount: number;
}

export interface ItemListActions {
    setActiveStatus: (activeStatus: StatusEnum) => void;
    setTagCount: (tagCount: number) => void;
    enableMultiselect: () => void;
    disableMultiselect: () => void;
    selectItem: (id: string) => void;
    showPanel: () => void;
    dismissPanel: () => void;
    reset: () => void;
}

const initialState: ItemListState = {
    activeStatus: StatusEnum.Inbox,
    isMultiselect: false,
    isShowPanel: false,
    selectedItems: new Set(),
    includedTags: new Set(),
    excludedTags: new Set(),
    tagCount: 0,
};

export const useItemListStore = create<ItemListState & ItemListActions>(
    (set) => ({
        ...initialState,

        setActiveStatus: (activeStatus) => set({ activeStatus }),
        setTagCount: (tagCount) => set({ tagCount }),

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
    })
);
