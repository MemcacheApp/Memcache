"use client";

import { StatusEnum, StatusNames } from "@/src/app/utils/Statuses";
import { trpc } from "@/src/app/utils/trpc";
import Image from "next/image";
import EmptyInbox from "@/public/EmptyInbox.svg";
import { ItemCard } from ".";
import { useMemo } from "react";

interface SaveListProps {
    activeStatus: StatusEnum;
    selectedItems: Set<string>;
    selectItem: (id: string) => void;
}

export function SaveList({
    activeStatus,
    selectedItems,
    selectItem,
}: SaveListProps) {
    const itemsQuery = trpc.item.getItems.useQuery();

    const items = useMemo(() => {
        if (itemsQuery.data) {
            return itemsQuery.data
                .filter(
                    (item) =>
                        activeStatus === null || activeStatus === item.status
                )
                .sort(
                    (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf() // sort by createdAt
                );
        } else {
            return [];
        }
    }, [itemsQuery.data, activeStatus]);

    return (
        <div className="flex flex-col mt-3 gap-3 md:px-8 pb-8">
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
                <div className="w-full px-6 my-8 flex flex-col items-center gap-4">
                    <Image
                        src={EmptyInbox}
                        width="128"
                        height="128"
                        alt="Empty Inbox"
                    />
                    <div>{`No saves in ${StatusNames[activeStatus]}`}</div>
                </div>
            )}
        </div>
    );
}
