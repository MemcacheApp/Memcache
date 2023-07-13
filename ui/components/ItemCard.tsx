"use client";

import { StatusEnum, StatusIcons } from "@/src/app/utils/Statuses";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuIconItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    Card,
    CardTitle,
    CardFooter,
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
    Newspaper,
    LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { cn } from "../utils";
import ExternalLink from "./ExternalLink";
import renderIcon from "@/src/app/utils/renderIcon";
import { useState } from "react";
import { Experience, Finetuning } from "@/src/datatypes/summary";

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
                        <Link href={`/app/collection/${data.collection.id}`}>
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
                    </div>
                </CardFooter>
            </Card>
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
    data: Item & { collection: Collection; tags: Tag[] };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function SummariesDialog({ data, open, onOpenChange }: SummariesDialogProps) {
    const [numberOfWords, setNumberOfWords] = useState(250);
    const [experience, setExperience] = useState(Experience.Intermediate);
    const [finetuning, setFinetuning] = useState(Finetuning.Qualitative);

    const generateSummaryMutation = trpc.summary.summariserGenerate.useMutation(
        {
            onSuccess(data) {
                console.log(data);
            },
        }
    );

    const handleSubmit = () => {
        generateSummaryMutation.mutate({
            id: data.id,
            url: data.url,
            description: data.description,
            wordCount: numberOfWords,
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
                            value={numberOfWords}
                            onChange={(e) =>
                                setNumberOfWords(parseInt(e.target.value))
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
