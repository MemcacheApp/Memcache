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
    SummaryCard,
} from ".";
import { trpc } from "../../src/app/utils/trpc";
import { Item, Collection, Tag, Summary } from "@prisma/client";
import {
    ExternalLink as ExternalLinkIcon,
    Trash2,
    MoreHorizontal,
    PanelRightOpen,
    Newspaper,
    LayoutDashboard,
    PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "../utils";
import renderIcon from "@/src/app/utils/renderIcon";
import { useState } from "react";
import { Experience, Finetuning } from "@/src/datatypes/summary";

interface ItemCardProps {
    data: Item & { collection: Collection; tags: Tag[] };
    selected?: boolean;
    onSelect?: (id: string) => void;
    className?: string;
    hideOptions?: boolean;
}

export function ItemCard({
    data,
    selected,
    onSelect,
    className,
    hideOptions,
}: ItemCardProps) {
    const [isOpenSummaries, setIsOpenSummaries] = useState(false);
    const [isOpenGenerateSummary, setIsOpenGenerateSummary] = useState(false);

    const ctx = trpc.useContext();

    const getItemSummariesQuery = trpc.summary.getItemSummaries.useQuery({
        itemId: data.id,
    });
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

    const openSummaries = () => {
        if (getItemSummariesQuery.data) {
            if (getItemSummariesQuery.data.length > 0) {
                setIsOpenSummaries(true);
            } else {
                setIsOpenGenerateSummary(true);
            }
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
                        : "scale-100",
                    className
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
                footerRight={
                    hideOptions ? undefined : (
                        <>
                            <ItemDropdownMenu
                                data={data}
                                openSummaries={openSummaries}
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
                    )
                }
            />
            <SummariesDialog
                open={isOpenSummaries}
                onOpenChange={setIsOpenSummaries}
                data={data}
                summaries={getItemSummariesQuery.data}
                newSummary={() => setIsOpenGenerateSummary(true)}
            />
            <GenerateSummaryDialog
                data={data}
                open={isOpenGenerateSummary}
                onOpenChange={setIsOpenGenerateSummary}
                viewSummaries={() => setIsOpenSummaries(true)}
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
    data: Item & { collection: Collection; tags: Tag[] };
    summaries: (Summary & { isFullText: boolean })[] | undefined;
    newSummary: () => void;
}

function SummariesDialog({
    open,
    onOpenChange,
    data,
    summaries,
    newSummary,
}: SummariesDialogProps) {
    const handleNewSummary = () => {
        onOpenChange(false);
        newSummary();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Summaries</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-5">
                    {summaries?.map((summary) => (
                        <SummaryCard
                            key={summary.id}
                            item={data}
                            summary={summary}
                        />
                    ))}
                    <Button variant="outline" onClick={handleNewSummary}>
                        <PlusIcon className="mr-2" size={16} /> Generate New
                        Summary
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface GenerateSummaryDialogProps {
    data: Item & { collection: Collection; tags: Tag[] };
    open: boolean;
    onOpenChange: (open: boolean) => void;
    viewSummaries: () => void;
}

function GenerateSummaryDialog({
    data,
    open,
    onOpenChange,
    viewSummaries,
}: GenerateSummaryDialogProps) {
    const ctx = trpc.useContext();

    const [numOfWords, setNumOfWords] = useState(250);
    const [experience, setExperience] = useState(Experience.Intermediate);
    const [finetuning, setFinetuning] = useState(Finetuning.Qualitative);

    const generateSummaryMutation = trpc.summary.generateSummary.useMutation({
        onSuccess() {
            ctx.summary.getItemSummaries.invalidate({ itemId: data.id });
            onOpenChange(false);
            viewSummaries();
        },
    });

    const handleSubmit = () => {
        generateSummaryMutation.mutate({
            itemId: data.id,
            numOfWords,
            experience,
            finetuning,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Summary</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="numofwords">Number of words</Label>
                        <Input
                            className="w-32"
                            id="numofwords"
                            type="number"
                            value={numOfWords}
                            onChange={(e) =>
                                setNumOfWords(parseInt(e.target.value))
                            }
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="experience">Experience</Label>
                        <Tabs
                            id="experience"
                            value={experience.toString()}
                            onValueChange={(value) =>
                                setExperience(parseInt(value))
                            }
                        >
                            <TabsList>
                                <TabsTrigger
                                    value={Experience.Beginner.toString()}
                                >
                                    Beginner
                                </TabsTrigger>
                                <TabsTrigger
                                    value={Experience.Intermediate.toString()}
                                >
                                    Intermediate
                                </TabsTrigger>
                                <TabsTrigger
                                    value={Experience.Advanced.toString()}
                                >
                                    Advanced
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="finetuning">Finetuning</Label>
                        <Tabs
                            id="finetuning"
                            value={finetuning.toString()}
                            onValueChange={(value) =>
                                setFinetuning(parseInt(value))
                            }
                        >
                            <TabsList>
                                <TabsTrigger
                                    value={Finetuning.Qualitative.toString()}
                                >
                                    Qualitative
                                </TabsTrigger>
                                <TabsTrigger
                                    value={Finetuning.Quantitative.toString()}
                                >
                                    Quantitative
                                </TabsTrigger>
                                <TabsTrigger
                                    value={Finetuning.Mixed.toString()}
                                >
                                    Mixed
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={generateSummaryMutation.isLoading}
                    >
                        Generate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
