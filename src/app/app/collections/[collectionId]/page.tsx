"use client";

import {
    LogInRequired,
    PageTitle,
    SaveInput,
    ItemPanel,
    WithPanel,
    ItemList,
} from "@/ui/components";
import { useItemListStore } from "@/src/app/store/item-list";
import { useEffect } from "react";
import { trpc } from "@/src/app/utils/trpc";

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
                    <ItemList collectionId={params.collectionId} />
                </WithPanel>
                <ItemPanel />
            </LogInRequired>
        </div>
    );
}
