"use client";

import {
    LogInRequired,
    PageTitle,
    SaveInput,
    ItemPanel,
    WithPanel,
    ItemList,
} from "@/ui/components";
import { useItemListStore } from "../../store/item-list";
import { useEffect } from "react";

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
                    <ItemList />
                </WithPanel>
                <ItemPanel />
            </LogInRequired>
        </div>
    );
}
