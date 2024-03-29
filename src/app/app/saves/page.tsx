"use client";

import {
    ItemList,
    ItemListOptions,
    ItemPanel,
    PageTitle,
    SaveInput,
    SaveInputTrigger,
    Topbar,
    TopbarTitle,
    WithPanel,
} from "@/ui/components";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useItemListStore } from "../../store/item-list";

export default function SavesPage() {
    const { reset, setIncludedTags } = useItemListStore((state) => ({
        reset: state.reset,
        setIncludedTags: state.setIncludedTags,
    }));
    const searchParams = useSearchParams();

    useEffect(() => {
        reset();
        const tag = searchParams.get("tag");
        if (tag) {
            setIncludedTags(new Set([tag]));
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col">
            <WithPanel>
                <Topbar startPos={200}>
                    <SaveInput className="flex items-center grow">
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
        </div>
    );
}
