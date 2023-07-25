"use client";

import {
    ItemList,
    ItemListOptions,
    ItemPanel,
    LogInRequired,
    PageTitle,
    SaveInput,
    Topbar,
    TopbarTitle,
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
                    <Topbar startPos={200}>
                        <TopbarTitle>Saves</TopbarTitle>
                        <ItemListOptions className="grow ml-5 overflow-hidden" />
                    </Topbar>
                    <PageTitle>Saves</PageTitle>
                    <SaveInput />
                    <ItemListOptions className="mb-3 max-md:mx-5 mx-8" />
                    <ItemList />
                </WithPanel>
                <ItemPanel />
            </LogInRequired>
        </div>
    );
}
