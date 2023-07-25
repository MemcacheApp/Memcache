"use client";

import EmptyInbox from "@/public/EmptyInbox.svg";
import { useItemListStore } from "@/src/app/store/item-list";
import { trpc } from "@/src/app/utils/trpc";
import { ItemStatus } from "@prisma/client";
import Image from "next/image";
import { useMemo } from "react";
import { ItemCard } from ".";

interface ItemListProps {
    collectionId?: string;
}

export function ItemList(props: ItemListProps) {
    const { collectionId } = props;

    const {
        selectItem,
        activeStatus,
        selectedItems,
        includedTags,
        excludedTags,
    } = useItemListStore((state) => ({
        selectItem: state.selectItem,
        activeStatus: state.activeStatus,
        selectedItems: state.selectedItems,
        includedTags: state.includedTags,
        excludedTags: state.excludedTags,
    }));

    const itemsQuery = trpc.item.getUserItems.useQuery({
        includedTags:
            includedTags.size > 0 ? Array.from(includedTags) : undefined,
        excludedTags:
            excludedTags.size > 0 ? Array.from(excludedTags) : undefined,
    });

    const items = useMemo(() => {
        if (itemsQuery.data) {
            let items = itemsQuery.data;

            if (collectionId) {
                items = items.filter(
                    (item) => collectionId === item.collection.id,
                );
            }
            return items
                .filter((item) => activeStatus === item.status)
                .sort(
                    (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf(), // sort by createdAt
                );
        } else {
            return [];
        }
    }, [itemsQuery.data, activeStatus, includedTags, excludedTags]);

    return (
        <div className="flex flex-col gap-3 pb-8 md:mx-8">
            {items && items.length > 0 ? (
                items.map((item) => (
                    <ItemCard
                        data={item}
                        key={item.id}
                        selected={selectedItems.has(item.id)}
                        onSelect={selectItem}
                    />
                ))
            ) : (
                <div className="flex flex-col items-center w-full gap-4 px-6 my-8">
                    <Image
                        src={EmptyInbox}
                        width="128"
                        height="128"
                        alt="Empty Inbox"
                    />
                    <div>{`No saves in ${ItemStatus[activeStatus]}`}</div>
                </div>
            )}
        </div>
    );
}
