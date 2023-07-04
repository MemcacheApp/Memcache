"use client";

import { StatusEnum, StatusNames } from "@/src/app/utils/Statuses";
import { trpc } from "@/src/app/utils/trpc";
import Image from "next/image";
import EmptyInbox from "@/public/EmptyInbox.svg";
import { Button, ItemCard } from ".";
import { useMemo } from "react";
import {
    Archive,
    CheckCircle2,
    CircleDot,
    Inbox,
    SquareStack,
    X,
} from "lucide-react";
import { useItemListStore } from "@/src/app/store/item-list";
import { cn } from "../utils";

export function ItemList() {
    const { activeStatus, selectedItems, selectItem } = useItemListStore(
        (state) => ({
            activeStatus: state.activeStatus,
            selectedItems: state.selectedItems,
            selectItem: state.selectItem,
        })
    );

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
        <div className="flex flex-col gap-3 md:mx-8 pb-8">
            <Options />
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
function Options() {
    const isMultiselect = useItemListStore((state) => state.isMultiselect);

    return (
        <div className="max-md:mx-5 flex items-center gap-5">
            {isMultiselect ? <MultiselectOptions /> : <NormalOptions />}
        </div>
    );
}

function NormalOptions() {
    const enableMultiselect = useItemListStore(
        (state) => state.enableMultiselect
    );

    return (
        <>
            <StatusToggle />
            <Button
                variant="outline"
                className="w-10 rounded-full p-0 shrink-0"
                onClick={enableMultiselect}
            >
                <div className="flex items-center justify-center h-4 w-4">
                    <SquareStack />
                </div>
                <span className="sr-only">Multiselect</span>
            </Button>
        </>
    );
}

function MultiselectOptions() {
    const { selectedItems, showPanel, disableMultiselect } = useItemListStore(
        (state) => ({
            selectedItems: state.selectedItems,
            showPanel: state.showPanel,
            disableMultiselect: state.disableMultiselect,
        })
    );

    return (
        <>
            <div className="flex items-center h-12 gap-5 whitespace-nowrap overflow-x-auto grow">
                <div className="flex items-center">
                    <SquareStack size={18} className="mr-2" />
                    <span className="font-medium">
                        Selected {selectedItems.size}
                        {selectedItems.size === 1 ? " item" : " items"}
                    </span>
                </div>
                <div
                    className={cn("flex items-center gap-3", {
                        hidden: selectedItems.size === 0,
                    })}
                >
                    <Button variant="outline">Move to</Button>
                    <Button variant="outline">Mark as</Button>
                    <Button variant="outline" onClick={showPanel}>
                        More
                    </Button>
                </div>
            </div>
            <Button
                variant="outline"
                className="w-10 rounded-full p-0 shrink-0"
                onClick={disableMultiselect}
            >
                <div className="flex items-center justify-center h-4 w-4">
                    <X />
                </div>
                <span className="sr-only">Exit Multiselect</span>
            </Button>
        </>
    );
}

function StatusToggle() {
    const { activeStatus, setActiveStatus } = useItemListStore((state) => ({
        activeStatus: state.activeStatus,
        setActiveStatus: state.setActiveStatus,
    }));

    return (
        <div className="flex items-center space-x-3 h-12 overflow-x-auto grow">
            <Button
                variant={
                    activeStatus === StatusEnum.Inbox ? "default" : "outline"
                }
                onClick={() => setActiveStatus(StatusEnum.Inbox)}
            >
                <Inbox className="mr-2" size={18} />
                Inbox
            </Button>
            <Button
                variant={
                    activeStatus === StatusEnum.Underway ? "default" : "outline"
                }
                onClick={() => setActiveStatus(StatusEnum.Underway)}
            >
                <CircleDot className="mr-2" size={18} />
                Underway
            </Button>
            <Button
                variant={
                    activeStatus === StatusEnum.Complete ? "default" : "outline"
                }
                onClick={() => setActiveStatus(StatusEnum.Complete)}
            >
                <CheckCircle2 className="mr-2" size={18} />
                Complete
            </Button>
            <Button
                variant={
                    activeStatus === StatusEnum.Archive ? "default" : "outline"
                }
                onClick={() => setActiveStatus(StatusEnum.Archive)}
            >
                <Archive className="mr-2" size={18} />
                Archive
            </Button>
        </div>
    );
}