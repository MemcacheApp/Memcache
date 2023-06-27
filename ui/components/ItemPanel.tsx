"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Card } from "./Card";
import { PanelRightClose } from "lucide-react";
import { Button } from "./Button";

interface ItemPanelProps {
    selectedItem: string;
    dismiss: () => void;
}

export function ItemPanel({ selectedItem, dismiss }: ItemPanelProps) {
    const itemQuery = trpc.item.getItem.useQuery({ itemId: selectedItem });
    const data = itemQuery.data;

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
            <div>{data?.title}</div>
        </Card>
    );
}
