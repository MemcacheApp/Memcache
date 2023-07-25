"use client";

import {
    ItemList,
    ItemListOptions,
    ItemPanel,
    LogInRequired,
    PageTitle,
    SaveInput,
    WithPanel,
} from "@/ui/components";
import { useEffect } from "react";
import { useItemListStore } from "../../store/item-list";

export default function SavesPage() {
    const resetStates = useItemListStore((state) => state.reset);

    useEffect(() => {
        resetStates();
    }, []);

    return (
        <div className="flex flex-col">
            <LogInRequired>
                <WithPanel>
                    <PageTitle>Saves</PageTitle>
                    <SaveInput />
                    <ItemListOptions />
                    <ItemList />
                </WithPanel>
                <ItemPanel />
            </LogInRequired>
        </div>
    );
}
