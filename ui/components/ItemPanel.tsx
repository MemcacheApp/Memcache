"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Card } from "./Card";
import { PanelRightClose } from "lucide-react";
import { Button } from "./Button";
import { monthNames } from "@/src/app/utils/month-names";

interface ItemPanelProps {
    selectedItem: string;
    dismiss: () => void;
}

export function ItemPanel({ selectedItem, dismiss }: ItemPanelProps) {
    const itemQuery = trpc.item.getItem.useQuery({ itemId: selectedItem });
    const data = itemQuery.data;

    if (!data) {
        dismiss();
        return null;
    }

    return (
        <Card className="fixed right-5 w-80 p-4">
            <div className="flex">
                <Button
                    variant="ghost"
                    className="m-3 w-10 !rounded-full p-0"
                    onClick={dismiss}
                >
                    <div className="h-4 w-4">
                        <PanelRightClose size={16} />
                    </div>
                    <span className="sr-only">Toggle sidebar</span>
                </Button>
            </div>
            <div className="text-xl font-bold">{data.title}</div>
            <div>{data.description}</div>
            <div>{data.type}</div>
            <div>{data.status}</div>
            <div>{data.collection.name}</div>
            <div>{data.url}</div>
            <div>{data.thumbnail}</div>
            <div>{`${data.createdAt.getDate()} ${
                monthNames[data.createdAt.getMonth()]
            }, ${data.createdAt.getFullYear()}`}</div>
            <div>{`${data.createdAt.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })}`}</div>
            {data.releaseTime ? (
                <div>{`${data.releaseTime.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}`}</div>
            ) : null}
            <div>{data.siteName}</div>
            {data.duration ? <div>{data.duration}</div> : null}
            {data.author ? <div>{data.author}</div> : null}
        </Card>
    );
}
