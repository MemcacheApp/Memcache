"use client";

import { StatusEnum, StatusIcons } from "@/src/app/utils/Statuses";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuIconItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Label,
    Input,
    Tabs,
    TabsList,
    TabsTrigger,
    DialogFooter,
    SimpleItemCard,
} from ".";
import { trpc } from "../../src/app/utils/trpc";
import { Item, Collection, Tag } from "@prisma/client";
import {
    ExternalLink as ExternalLinkIcon,
    Trash2,
    MoreHorizontal,
    PanelRightOpen,
    Newspaper,
    LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { cn } from "../utils";
import renderIcon from "@/src/app/utils/renderIcon";
import { useState } from "react";

interface ItemCardProps {
    data: Item & { collection: Collection; tags: Tag[] };
    selected: boolean;
    onSelect: (id: string) => void;
}

export function ItemCard({ data, selected, onSelect }: ItemCardProps) {
    const [isOpenSummaries, setIsOpenSummaries] = useState(false);

    const ctx = trpc.useContext();

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
        <>
            <SimpleItemCard
                className={cn(
                    "transition-[transform,border-color]",
                    selected
                        ? "scale-[101%] shadow-md border-slate-500"
                        : "scale-100"
                )}
                onClick={() => {
                    onSelect(data.id);
                }}
                url={data.url}
                title={data.title}
                collection={data.collection}
                tags={data.tags}
                description={data.description}
                thumbnail={data.thumbnail}
                siteName={data.siteName}
                favicon={data.favicon}
                footerRight={
                    <>
                        <ItemDropdownMenu
                            data={data}
                            openSummaries={() => setIsOpenSummaries(true)}
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
                                {renderIcon(StatusIcons[value])}
                            </Button>
                        ))}
                    </>
                }
            />
            <SummariesDialog
                open={isOpenSummaries}
                onOpenChange={setIsOpenSummaries}
            />
        </>
    );
}

interface ItemDropdownMenuProps {
    data: Item & { collection: Collection; tags: Tag[] };
    openSummaries: () => void;
}

function ItemDropdownMenu({ data, openSummaries }: ItemDropdownMenuProps) {
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
                    <DropdownMenuIconItem Icon={LayoutDashboard}>
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

interface SummariesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function SummariesDialog({ open, onOpenChange }: SummariesDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Summaries</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="numofwords">Number of words</Label>
                        <Input
                            className="w-32"
                            id="numofwords"
                            type="number"
                            defaultValue={250}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="experience">Experience</Label>
                        <Tabs id="experience" defaultValue="intermediate">
                            <TabsList>
                                <TabsTrigger value="beginner">
                                    Beginner
                                </TabsTrigger>
                                <TabsTrigger value="intermediate">
                                    Intermediate
                                </TabsTrigger>
                                <TabsTrigger value="advanced">
                                    Advanced
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="finetuning">Finetuning</Label>
                        <Tabs id="finetuning" defaultValue="qualitative">
                            <TabsList>
                                <TabsTrigger value="qualitative">
                                    Qualitative
                                </TabsTrigger>
                                <TabsTrigger value="quantitative">
                                    Quantitative
                                </TabsTrigger>
                                <TabsTrigger value="mixed">Mixed</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
                <DialogFooter>
                    <Button>Generate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
