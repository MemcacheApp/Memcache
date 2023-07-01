"use client";

import React, { useState } from "react";

import {
    LogInRequired,
    PageTitle,
    SaveInput,
    StatusToggle,
    ItemCard,
    ItemPanel,
    Button,
} from "@/ui/components";
import { trpc } from "@/src/app/utils/trpc";
import Image from "next/image";
import EmptyInbox from "@/public/EmptyInbox.svg";
import { StatusEnum, StatusNames } from "../../utils/Statuses";
import { Square, SquareStack } from "lucide-react";
import { cn } from "@/ui/utils";
import { useSidebarStore } from "../../store/sidebar";

export default function SavesPage() {
    const isSidebarExpand = useSidebarStore((state) => state.isExpand);

    const [activeStatus, setActiveStatus] = React.useState<StatusEnum>(
        StatusEnum.Inbox
    );
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [isMultiselect, setIsMultiselect] = useState(false);

    const selectItem = (id: string) => {
        if (isMultiselect) {
            setSelectedItems((prev) => {
                const next = new Set(prev);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    next.add(id);
                }
                return next;
            });
        } else {
            setSelectedItems(new Set([id]));
        }
    };

    const clearSelectedItems = () => {
        setSelectedItems(new Set());
        setIsMultiselect(false);
    };

    const isShowPanel = isMultiselect || selectedItems.size > 0;

    return (
        <div className="flex flex-col">
            <LogInRequired>
                <div
                    className={cn("transition-[margin-right] max-md:mr-0", {
                        "max-[1800px]:mr-[calc(20rem-(100vw-16rem)/2+50%)]":
                            isSidebarExpand && isShowPanel,
                        "max-[1800px]:mr-[calc(20rem-100vw/2+50%)]":
                            !isSidebarExpand && isShowPanel,
                    })}
                >
                    <PageTitle>Saves</PageTitle>
                    <div className="px-8 max-md:px-5">
                        <SaveInput />
                        <div className="flex justify-between items-center">
                            <StatusToggle
                                activeStatus={activeStatus}
                                setActiveStatus={setActiveStatus}
                            />
                            <Button
                                variant="ghost"
                                className="hover:bg-background w-10 rounded-full p-0"
                                onClick={() =>
                                    setIsMultiselect((prev) => !prev)
                                }
                            >
                                <div className="flex items-center justify-center h-4 w-4">
                                    {isMultiselect ? (
                                        <SquareStack />
                                    ) : (
                                        <Square />
                                    )}
                                </div>
                                <span className="sr-only">Toggle sidebar</span>
                            </Button>
                        </div>
                    </div>
                    <SaveList
                        activeStatus={activeStatus}
                        selectedItems={selectedItems}
                        selectItem={selectItem}
                    />
                </div>
                {isShowPanel ? (
                    <ItemPanel
                        selectedItems={selectedItems}
                        dismiss={clearSelectedItems}
                    />
                ) : null}
            </LogInRequired>
        </div>
    );
}

interface SaveListProps {
    activeStatus: StatusEnum;
    selectedItems: Set<string>;
    selectItem: (id: string) => void;
}

function SaveList({ activeStatus, selectedItems, selectItem }: SaveListProps) {
    const itemsQuery = trpc.item.getItems.useQuery();

    let items = itemsQuery.data;

    items = items?.filter((item) => {
        return activeStatus === null || activeStatus === item.status;
    });

    items = items?.sort(
        (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf() // sort by createdAt
    );

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
