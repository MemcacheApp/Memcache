"use client";

import { Collection, Item, ItemStatus, Tag } from "@prisma/client";
import {
    ExternalLink as ExternalLinkIcon,
    LayoutDashboard,
    MoreHorizontal,
    Newspaper,
    PanelRightOpen,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuIconItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    SimpleItemCard,
    SimpleItemCardFormat,
} from ".";
import { trpc } from "../../src/app/utils/trpc";
import { cn } from "../utils";
import {
    FlashcardsDialog,
    GenerateSummaryDialog,
    SummariesDialog,
} from "./GenerationDialog";
import { StatusIcon } from "./StatusIcon";

interface ItemCardProps {
    data: Item & { collection: Collection; tags: Tag[] };
    selected?: boolean;
    onSelect?: (id: string) => void;
    className?: string;
    hideOptions?: boolean;
    format?: SimpleItemCardFormat;
}

export function ItemCard({
    data,
    selected,
    onSelect,
    className,
    hideOptions,
    format,
}: ItemCardProps) {
    const [isOpenSummaries, setIsOpenSummaries] = useState(false);
    const [isOpenGenrateSummary, setIsOpenGenerateSummary] = useState(false);
    const [isOpenFlashcards, setIsOpenFlashcards] = useState(false);

    const ctx = trpc.useContext();

    const updateItemStatusMutation = trpc.item.setItemStatus.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
    });

    const handleUpdateItemStatus = async (newStatus: ItemStatus) => {
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

    const openSummaries = () => {
        setIsOpenSummaries(true);
    };

    const openFlashcards = () => {
        setIsOpenFlashcards(true);
    };

    const statusNums = Object.values(ItemStatus);

    return (
        <>
            <SimpleItemCard
                className={cn(
                    "transition-[transform,border-color]",
                    selected
                        ? "scale-[101%] shadow-md border-slate-500"
                        : "scale-100",
                    className,
                )}
                onClick={
                    onSelect
                        ? () => {
                              onSelect(data.id);
                          }
                        : undefined
                }
                url={data.url}
                type={data.type}
                title={data.title}
                collection={data.collection}
                tags={data.tags}
                description={data.description}
                thumbnail={data.thumbnail}
                siteName={data.siteName}
                favicon={data.favicon}
                format={format}
                footerRight={
                    hideOptions ? undefined : (
                        <>
                            <ItemDropdownMenu
                                data={data}
                                openSummaries={openSummaries}
                                openFlashcards={openFlashcards}
                            />
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
                                    <StatusIcon status={value} size={18} />
                                </Button>
                            ))}
                        </>
                    )
                }
            />
            <SummariesDialog
                data={data}
                open={isOpenSummaries}
                onOpenChange={setIsOpenSummaries}
                newSummary={() => setIsOpenGenerateSummary(true)}
            />
            <GenerateSummaryDialog
                data={data}
                open={isOpenGenrateSummary}
                onOpenChange={setIsOpenGenerateSummary}
                viewSummaries={() => setIsOpenSummaries(true)}
            />
            <FlashcardsDialog
                data={data}
                open={isOpenFlashcards}
                onOpenChange={setIsOpenFlashcards}
            />
        </>
    );
}

interface ItemDropdownMenuProps {
    data: Item & { collection: Collection; tags: Tag[] };
    openSummaries: () => void;
    openFlashcards: () => void;
}

function ItemDropdownMenu({
    data,
    openSummaries,
    openFlashcards,
}: ItemDropdownMenuProps) {
    const ctx = trpc.useContext();

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

    return (
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
                    <DropdownMenuIconItem
                        Icon={LayoutDashboard}
                        onClick={(e) => {
                            e.stopPropagation();
                            openFlashcards();
                        }}
                    >
                        Flashcards
                    </DropdownMenuIconItem>
                    <DropdownMenuIconItem
                        Icon={Newspaper}
                        onClick={(e) => {
                            e.stopPropagation();
                            openSummaries();
                        }}
                    >
                        Summaries
                    </DropdownMenuIconItem>
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
    );
}
