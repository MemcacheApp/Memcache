"use client";

import { StatusEnum, StatusIcons } from "@/src/app/utils/Statuses";
import renderIcon from "@/src/app/utils/renderIcon";
import { Range } from "@/src/datatypes/flashcard";
import { Experience, Finetuning } from "@/src/datatypes/summary";
import { Collection, Item, Tag } from "@prisma/client";
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
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuIconItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Input,
    Label,
    SimpleItemCard,
    Tabs,
    TabsList,
    TabsTrigger,
} from ".";
import { trpc } from "../../src/app/utils/trpc";
import { cn } from "../utils";

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
        (value): value is number => typeof value === "number",
    );

    const generateFlashcardsMutation =
        trpc.flashcards.generateFlashcards.useMutation({
            onSuccess: () => {
                console.log("successfully generated flashcards");
            },
            onError: (err) => {
                console.error(err);
            },
        });

    const handleGenerateFlashcards = (itemId: string) => {
        generateFlashcardsMutation.mutate({
            itemId,
            numOfFlashcards: 4,
            experience: Experience.Intermediate,
            range: Range.Balanced,
        });
    };

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
                footerRight={
                    hideOptions ? undefined : (
                        <>
                            <ItemDropdownMenu
                                data={data}
                                openSummaries={() => setIsOpenSummaries(true)}
                                // TODO: open flashcards options dialog
                                openFlashcards={() =>
                                    handleGenerateFlashcards(data.id)
                                }
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
                data={data}
                open={isOpenSummaries}
                onOpenChange={setIsOpenSummaries}
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

interface SummariesDialogProps {
    data: Item & { collection: Collection; tags: Tag[] };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function SummariesDialog({ data, open, onOpenChange }: SummariesDialogProps) {
    const [numOfWords, setNumOfWords] = useState(250);
    const [experience, setExperience] = useState(Experience.Intermediate);
    const [finetuning, setFinetuning] = useState(Finetuning.Qualitative);

    const generateSummaryMutation = trpc.summary.generateSummary.useMutation({
        onSuccess(data) {
            console.log(data);
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
                    <DialogTitle>Summaries</DialogTitle>
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
                    <Button onClick={handleSubmit}>Generate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
