"use client";
import React, { useState } from "react";

import {
    Card,
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
import classNames from "classnames";
import { PanelRight } from "lucide-react";
import { StatusEnum } from "../../utils/Statuses";

export default function SavesPage() {
    const [activeStatus, setActiveStatus] = React.useState<StatusEnum>(
        StatusEnum.Inbox
    );
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const dismissPanel = () => {
        setSelectedItem(null);
    };

    return (
        <div className="flex flex-col">
            <LogInRequired>
                <div className={classNames({ "mr-80": selectedItem })}>
                    <PageTitle>Saves</PageTitle>
                    <SaveInput />
                    <StatusToggle
                        activeStatus={activeStatus}
                        setActiveStatus={setActiveStatus}
                    />
                    <SaveList
                        activeStatus={activeStatus}
                        setSelectedItem={setSelectedItem}
                    />
                </div>
                {selectedItem ? (
                    <ItemPanel
                        selectedItem={selectedItem}
                        dismiss={dismissPanel}
                    />
                ) : null}
            </LogInRequired>
        </div>
    );
}

interface SaveListProps {
    activeStatus: StatusEnum;
    setSelectedItem: (id: string) => void;
}

function SaveList({ activeStatus, setSelectedItem }: SaveListProps) {
    const itemsQuery = trpc.item.getItems.useQuery();

    let items = itemsQuery.data;

    items = items?.filter((item) => {
        return activeStatus === null || activeStatus === item.status;
    });

    items = items?.sort(
        (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf() // sort by createdAt
    );

    const onItemSelect = (id: string) => {
        setSelectedItem(id);
    };

    return (
        <div className="flex flex-col mt-3 gap-3">
            {items && items.length > 0 ? (
                items.map((item) => (
                    <ItemCard
                        data={item}
                        key={item.id}
                        onSelect={onItemSelect}
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
                    <div>{`No saves in ${activeStatus}`}</div>
                </div>
            )}
        </div>
    );
}
