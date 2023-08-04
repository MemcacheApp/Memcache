"use client";

import { useItemListStore } from "@/src/app/store/item-list";
import { trpc } from "@/src/app/utils/trpc";
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
import { useEffect } from "react";

interface CollectionPageProps {
    params: {
        collectionId: string;
    };
}

export default function CollectionPage({ params }: CollectionPageProps) {
    const resetStates = useItemListStore((state) => state.reset);

    useEffect(() => {
        resetStates();
    }, []);

    const collectionQuery = trpc.collection.getCollection.useQuery({
        collectionId: params.collectionId,
    });
    const collection = collectionQuery.data;

    if (!collection) {
        return <PageTitle>This collection doesn&apos;t exist.</PageTitle>;
    }

    return (
        <div className="flex flex-col">
            <WithPanel>
                <Topbar startPos={200}>
                    <SaveInput className="flex items-center grow overflow-hidden">
                        <TopbarTitle>Collection: {collection.name}</TopbarTitle>
                        <ItemListOptions
                            showSave
                            className="grow ml-5 overflow-hidden"
                        />
                    </SaveInput>
                </Topbar>
                <PageTitle>Collection: {collection.name}</PageTitle>
                <SaveInput className="flex flex-col max-md:mx-5 mx-8 mb-5">
                    <SaveInputTrigger />
                </SaveInput>
                <ItemListOptions className="mb-3 max-md:mx-5 mx-8" />
                <ItemList collectionId={params.collectionId} />
            </WithPanel>
            <ItemPanel />
        </div>
    );
}
