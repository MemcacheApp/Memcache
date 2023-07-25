"use client";

import { useItemListStore } from "@/src/app/store/item-list";
import { trpc } from "@/src/app/utils/trpc";
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
            <LogInRequired>
                <WithPanel>
                    <PageTitle>Collection: {collection.name}</PageTitle>
                    <SaveInput />
                    <ItemListOptions />
                    <ItemList collectionId={params.collectionId} />
                </WithPanel>
                <ItemPanel />
            </LogInRequired>
        </div>
    );
}
