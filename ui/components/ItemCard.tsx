"use client";

import { StatusEnum, StatusIcons } from "@/src/app/utils/Statuses";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuIconItem,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    Card,
    CardTitle,
    CardFooter,
    Button,
} from ".";
import { trpc } from "../../src/app/utils/trpc";
import { Item, Collection, Tag } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import {
    Package2,
    ExternalLink as ExternalLinkIcon,
    Trash2,
    MoreHorizontal,
    PanelRightOpen,
    Globe,
    LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "../utils";
import ExternalLink from "./ExternalLink";
import renderIcon from "@/src/app/utils/renderIcon";

interface ItemCardProps {
    data: Item & { collection: Collection; tags: Tag[] };
    selected: boolean;
    onSelect: (id: string) => void;
}

export function ItemCard({ data, selected, onSelect }: ItemCardProps) {
    const queryClient = useQueryClient();

    const deleteItemMutation = trpc.item.deleteItem.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            });
            console.log("deleted item?");
        },
    });

    const handleDeleteItem = async () => {
        try {
            await deleteItemMutation.mutateAsync({ id: data.id });
        } catch (error) {
            console.error(error);
        }
    };

    const updateItemStatusMutation = trpc.item.updateItemStatus.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            });
            console.log("updated item status");
        },
    });

    const handleUpdateItemStatus = async (newStatus: StatusEnum) => {
        if (newStatus === data.status) {
            // Same status, no need to change
            return;
        }
        try {
            await updateItemStatusMutation.mutateAsync({
                itemId: data.id,
                status: newStatus,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card
            className={cn(
                "flex flex-col cursor-pointer hover:border-slate-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selected ? "outline" : "outline-none"
            )}
            tabIndex={0}
            key={data.id}
            onClick={() => {
                onSelect(data.id);
            }}
        >
            <div className="flex">
                <div className="flex flex-col grow p-6">
                    <CardTitle>{data.title}</CardTitle>
                    <p className="mt-3">{data.description}</p>
                </div>
                {data.thumbnail ? (
                    <div className="w-[320px] max-w-[32%] aspect-[16/9] m-6 shrink-0">
                        <img
                            src={data.thumbnail}
                            alt="Image"
                            className="rounded-lg object-cover object-center relative w-full h-full"
                        />
                    </div>
                ) : null}
            </div>
            <CardFooter className="flex flex-wrap gap-5 justify-between">
                <div className="flex flex-wrap gap-5 text-slate-450 text-sm">
                    <ExternalLink
                        href={data.url}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <span className="inline-flex items-center gap-2">
                            <Globe size={16} />
                            {data.siteName}
                        </span>
                    </ExternalLink>
                    <span className="inline-flex items-center gap-2">
                        <Package2 size={16} />
                        <Link
                            className="hover:underline"
                            href={`/app/collection/${data.collection.id}`}
                        >
                            {data.collection.name}
                        </Link>
                    </span>
                    <div className="flex flex-wrap gap-3">
                        {data.tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={`/app/tag/${tag.id}`}
                                tabIndex={-1}
                            >
                                <Button
                                    className="px-4"
                                    variant="secondary"
                                    size="xs"
                                >
                                    {tag.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"icon"} size={"none"}>
                                <MoreHorizontal size={18} />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuIconItem Icon={ExternalLinkIcon}>
                                    Visit Link
                                </DropdownMenuIconItem>
                                <DropdownMenuIconItem Icon={PanelRightOpen}>
                                    Open Item
                                </DropdownMenuIconItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        Summaries
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>
                                                View Summaries
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Generate Summary
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        Flashcards
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>
                                                View Flashcards
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Generate Flashcards
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuIconItem
                                Icon={Trash2}
                                className="text-red-600"
                                onClick={handleDeleteItem}
                            >
                                Delete
                            </DropdownMenuIconItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {Object.values(StatusEnum)
                        .filter((value) => typeof value === "number")
                        .map((value) => (
                            <Button
                                key={value}
                                variant={"icon"}
                                size={"none"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (typeof value !== "number") return;
                                    handleUpdateItemStatus(value);
                                }}
                            >
                                {renderIcon(StatusIcons[value])}
                            </Button>
                        ))}
                </div>
            </CardFooter>
        </Card>
    );
}
