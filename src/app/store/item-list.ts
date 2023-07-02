import { create } from "zustand";
import { StatusEnum } from "../utils/Statuses";

export interface ItemListState {
    activeStatus: StatusEnum;
    isMultiselect: boolean;
    selectedItems: Set<string>;
    isShowPanel: boolean;
}

export interface ItemListActions {
    setActiveStatus: (activeStatus: StatusEnum) => void;
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
    selectedItems: new Set(),
    isShowPanel: false,
};

export const useItemListStore = create<ItemListState & ItemListActions>(
    (set) => ({
        ...initialState,

        setActiveStatus: (activeStatus) => set({ activeStatus }),

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
