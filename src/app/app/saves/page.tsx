"use client";

import {
    ItemList,
    ItemListOptions,
    ItemPanel,
    LogInRequired,
    PageTitle,
    SaveInput,
    SaveInputTrigger,
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
                        <SaveInput className="flex items-center grow overflow-hidden">
                            <TopbarTitle>Saves</TopbarTitle>
                            <ItemListOptions
                                showSave
                                className="grow ml-5 overflow-hidden"
                            />
                        </SaveInput>
                    </Topbar>
                    <PageTitle>Saves</PageTitle>
                    <SaveInput className="flex flex-col max-md:mx-5 mx-8 mb-5">
                        <SaveInputTrigger />
                    </SaveInput>
                    <ItemListOptions className="mb-3 max-md:mx-5 mx-8" />
                    <ItemList />
                </WithPanel>
                <ItemPanel />
            </LogInRequired>
        </div>
    );
}
