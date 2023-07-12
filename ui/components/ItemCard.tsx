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
import {
    Package2,
    ExternalLink as ExternalLinkIcon,
    Trash2,
    MoreHorizontal,
    PanelRightOpen,
    Globe,
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
    const ctx = trpc.useContext();
    const summariserMutation = trpc.summary.summariserGenerate.useMutation();

    const handleGenerateSummary = async () => {
        console.log(data);
        try {
            const result = await summariserMutation.mutateAsync({
                url: data.url,
                title: data.title,
                description: data.description,
                siteName: data.siteName,
                id: data.id,
            });
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteItemMutation = trpc.item.deleteItem.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
    });

    const handleDeleteItem = async () => {
        try {
            await deleteItemMutation.mutateAsync({ id: data.id });
        } catch (error) {
            console.error(error);
        }
    };

    const updateItemStatusMutation = trpc.item.updateItemStatus.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
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

    const statusNums = Object.values(StatusEnum).filter(
        (value): value is number => typeof value === "number"
    );

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
                        <div className="h-full flex items-center gap-2">
                            <Globe size={16} />
                            {data.siteName}
                        </div>
                    </ExternalLink>
                    <Link
                        className="hover:underline"
                        href={`/app/collection/${data.collection.id}`}
                    >
                        <div className="h-full flex items-center gap-2">
                            <Package2 size={16} />
                            {data.collection.name}
                        </div>
                    </Link>
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
                                <Link
                                    href={data.url}
                                    target="_blank"
                                    className="hover:no-underline"
                                >
                                    <DropdownMenuIconItem
                                        Icon={ExternalLinkIcon}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        Visit Link
                                    </DropdownMenuIconItem>
                                </Link>
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
                                                    handleGenerateSummary();
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
                    {statusNums.map((value) => (
                        <Button
                            key={value}
                            variant={"icon"}
                            size={"none"}
                            onClick={(e) => {
                                e.stopPropagation();
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
