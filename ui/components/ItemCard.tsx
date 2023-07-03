"use client";

import { StatusEnum } from "@/src/app/utils/Statuses";
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
    ExternalLink,
    Trash2,
    MoreHorizontal,
    PanelRightOpen,
    Inbox,
    CheckCircle2,
    CircleDot,
    Archive,
    Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AspectRatio } from "./AspectRatio";
import { cn } from "../utils";

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

    const handleUpdateItemStatus = async (newStatus: number) => {
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
                <div className="flex flex-wrap gap-5 text-slate-600 text-sm">
                    <span className="inline-flex items-center gap-2">
                        <Globe size={16} />
                        {data.siteName}
                    </span>
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
                                <DropdownMenuIconItem
                                    Icon={ExternalLink}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    Visit Link
                                </DropdownMenuIconItem>
                                <DropdownMenuIconItem Icon={PanelRightOpen}>
                                    Open Item
                                </DropdownMenuIconItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        Summaries
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                View Summaries
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                Generate Summary
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        Flashcards
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                View Flashcards
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteItem();
                                }}
                            >
                                Delete
                            </DropdownMenuIconItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant={"icon"}
                        size={"none"}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateItemStatus(StatusEnum.Inbox);
                        }}
                    >
                        <Inbox size={18} />
                    </Button>
                    <Button
                        variant={"icon"}
                        size={"none"}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateItemStatus(StatusEnum.Underway);
                        }}
                    >
                        <CircleDot size={18} />
                    </Button>
                    <Button
                        variant={"icon"}
                        size={"none"}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateItemStatus(StatusEnum.Complete);
                        }}
                    >
                        <CheckCircle2 size={18} />
                    </Button>
                    <Button
                        variant={"icon"}
                        size={"none"}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateItemStatus(StatusEnum.Archive);
                        }}
                    >
                        <Archive size={18} />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
