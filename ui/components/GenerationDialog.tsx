"use client";

import {
    FlashcardExperience,
    FlashcardExperienceNames,
    FlashcardRange,
} from "@/src/datatypes/flashcard";
import { Experience, Finetuning } from "@/src/datatypes/summary";
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Loader,
    SimpleItemCard,
    SummaryCard,
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/ui/components";
import { Collection, Item, Tag } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { trpc } from "../../src/app/utils/trpc";

interface SummariesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: Item & { collection: Collection; tags: Tag[] };
    newSummary: () => void;
}

export function SummariesDialog({
    open,
    onOpenChange,
    data,
    newSummary,
}: SummariesDialogProps) {
    const getItemSummariesQuery = trpc.summary.getItemSummaries.useQuery(
        {
            itemId: data.id,
        },
        { refetchOnWindowFocus: false, enabled: false },
    );

    const handleNewSummary = useCallback(() => {
        onOpenChange(false);
        newSummary();
    }, []);

    useEffect(() => {
        if (open) {
            if (getItemSummariesQuery.data === undefined) {
                getItemSummariesQuery.refetch();
            } else if (getItemSummariesQuery.data.length === 0) {
                handleNewSummary();
            }
        }
    }, [open]);

    useEffect(() => {
        if (
            open &&
            getItemSummariesQuery.data &&
            getItemSummariesQuery.data.length === 0
        ) {
            handleNewSummary();
        }
    }, [getItemSummariesQuery.data]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Summaries</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-5">
                    {getItemSummariesQuery.data !== undefined ? (
                        <>
                            <div className="flex flex-col gap-5 max-h-[60vh] overflow-auto">
                                {getItemSummariesQuery.data.map((summary) => (
                                    <SummaryCard
                                        className="shrink-0"
                                        key={summary.id}
                                        item={data}
                                        summary={summary}
                                    />
                                ))}
                            </div>
                            <Button onClick={handleNewSummary}>
                                <PlusIcon className="mr-2" size={18} /> Generate
                                New Summary
                            </Button>
                        </>
                    ) : (
                        <Loader varient="ellipsis" />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface GenerateSummaryDialogProps {
    data: (Item & { collection: Collection; tags: Tag[] }) | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    viewSummaries?: () => void;
}

export function GenerateSummaryDialog({
    data,
    open,
    onOpenChange,
    viewSummaries,
}: GenerateSummaryDialogProps) {
    const ctx = trpc.useContext();

    const [numOfWords, setNumOfWords] = useState(150);
    const [experience, setExperience] = useState(Experience.Intermediate);
    const [finetuning, setFinetuning] = useState(Finetuning.Qualitative);

    // Unlock to allow generate next summary after 1.2s, even if the generateSummaryMutation is still loading
    const [generationLock, setGenerationLock] = useState(false);

    const generateSummaryMutation = trpc.summary.generateSummary.useMutation({
        onSuccess() {
            if (data) {
                ctx.summary.getItemSummaries.invalidate({ itemId: data.id });
                ctx.summary.getLatestSummaries.invalidate();
                ctx.summary.getUserSummaries.invalidate();
                ctx.summary.getSuggestedItems.invalidate();
            }
            onOpenChange(false);
            if (viewSummaries) viewSummaries();
        },
    });

    const handleSubmit = () => {
        if (data) {
            setGenerationLock(true);
            generateSummaryMutation.mutate({
                itemId: data.id,
                numOfWords,
                experience,
                finetuning,
            });
            setTimeout(() => {
                setGenerationLock(false);
            }, 1200);
        }
    };

    if (!data) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[760px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Generate Summary
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6">
                    <SimpleItemCard
                        url={data.url}
                        title={data.title}
                        description={data.description}
                        type={data.type}
                        thumbnail={data.thumbnail}
                        siteName={data.siteName}
                        favicon={data.favicon}
                        className="bg-slate-100 border-none h-auto"
                    />
                    <div className="flex justify-between items-end gap-6">
                        <div className="flex flex-col gap-1">
                            <Label className="text-base" htmlFor="numofwords">
                                Number of words
                            </Label>
                            <DialogDescription>
                                {"Specify the length of your summary in words."}
                            </DialogDescription>
                        </div>
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
                    <div className="flex justify-between items-end gap-6">
                        <div className="flex flex-col gap-1">
                            <Label className="text-base" htmlFor="experience">
                                Experience
                            </Label>
                            <DialogDescription>
                                {
                                    "Level of expertise that the content in the summary will assume of the reader."
                                }
                            </DialogDescription>
                        </div>
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
                    <div className="flex justify-between items-end gap-6">
                        <div className="flex flex-col gap-1">
                            <Label className="text-base" htmlFor="finetuning">
                                Finetuning
                            </Label>
                            <DialogDescription>
                                {
                                    "Qualitative summaries emphasise the literary form and meaning of the content, whereas quantitative summaries emphasise hard facts and data."
                                }
                            </DialogDescription>
                        </div>
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
                        size="lg"
                        onClick={handleSubmit}
                        disabled={
                            generateSummaryMutation.isLoading && generationLock
                        }
                    >
                        {generateSummaryMutation.isLoading && generationLock ? (
                            <Loader varient="ring" colorWhite />
                        ) : (
                            "Generate"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
interface GenerateFlashcardsDialogProps {
    data: (Item & { collection: Collection; tags: Tag[] }) | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GenerateFlashcardsDialog({
    data,
    open,
    onOpenChange,
}: GenerateFlashcardsDialogProps) {
    const ctx = trpc.useContext();

    const [numOfFlashcards, setNumOfFlashcards] = useState(3);
    const [experience, setExperience] = useState<FlashcardExperience>(
        FlashcardExperience.Intermediate,
    );
    const [range, setRange] = useState<FlashcardRange>(FlashcardRange.Balanced);

    // Unlock to allow generate next summary after 1.2s, even if the generateSummaryMutation is still loading
    const [generationLock, setGenerationLock] = useState(false);

    const generateFlashcardsMutation =
        trpc.flashcards.generateFlashcards.useMutation({
            onSuccess: () => {
                ctx.flashcards.getUserFlashcards.invalidate();
                ctx.item.getUserItemsIncludeFlashcards.invalidate();
                ctx.flashcards.getUserRevisionQueue.invalidate();
                ctx.flashcards.getUserRecentlyCreated.invalidate();
                ctx.flashcards.getSuggestedItems.invalidate();
            },
            onError: (err) => {
                console.error(err);
            },
        });

    const handleSubmit = () => {
        if (data) {
            setGenerationLock(true);
            generateFlashcardsMutation.mutate({
                itemId: data.id,
                numOfFlashcards,
                experience,
                range,
            });
            // TODO: show toast notification: "Generating flashcards..."
            setTimeout(() => {
                setGenerationLock(false);
            }, 1200);
        }
    };

    if (!data) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[760px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Generate Flashcards
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6">
                    <SimpleItemCard
                        url={data.url}
                        title={data.title}
                        description={data.description}
                        type={data.type}
                        thumbnail={data.thumbnail}
                        siteName={data.siteName}
                        favicon={data.favicon}
                        className="bg-slate-100 border-none h-auto"
                    />
                    <div className="flex justify-between items-end gap-6">
                        <div className="flex flex-col gap-1">
                            <Label
                                className="text-base"
                                htmlFor="numofflashcards"
                            >
                                Number of flashcards
                            </Label>
                            <DialogDescription>
                                {
                                    "All flashcards generated in this batch will use the options below."
                                }
                            </DialogDescription>
                        </div>
                        <Input
                            className="w-32"
                            id="numofflashcards"
                            type="number"
                            value={numOfFlashcards}
                            onChange={(e) =>
                                setNumOfFlashcards(parseInt(e.target.value))
                            }
                        />
                    </div>
                    <div className="flex justify-between items-end gap-6">
                        <div className="flex flex-col gap-1">
                            <Label className="text-base" htmlFor="experience">
                                Experience
                            </Label>
                            <DialogDescription>
                                {
                                    "Level of expertise that the questions and answers in the generated flashcards will assume."
                                }
                            </DialogDescription>
                        </div>
                        <Tabs
                            id="experience"
                            value={experience}
                            onValueChange={(value) =>
                                (
                                    Object.values(
                                        FlashcardExperience,
                                    ) as string[]
                                ).includes(value)
                                    ? setExperience(
                                          value as FlashcardExperience,
                                      )
                                    : setExperience(
                                          FlashcardExperience.Intermediate,
                                      )
                            }
                        >
                            <TabsList>
                                <TabsTrigger
                                    value={FlashcardExperience.Beginner.toString()}
                                >
                                    {
                                        FlashcardExperienceNames[
                                            FlashcardExperience.Beginner
                                        ]
                                    }
                                </TabsTrigger>
                                <TabsTrigger
                                    value={FlashcardExperience.Intermediate.toString()}
                                >
                                    {
                                        FlashcardExperienceNames[
                                            FlashcardExperience.Intermediate
                                        ]
                                    }
                                </TabsTrigger>
                                <TabsTrigger
                                    value={FlashcardExperience.Advanced.toString()}
                                >
                                    {
                                        FlashcardExperienceNames[
                                            FlashcardExperience.Advanced
                                        ]
                                    }
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex justify-between items-end gap-6">
                        <div className="flex flex-col gap-1">
                            <Label className="text-base" htmlFor="range">
                                Range
                            </Label>
                            <DialogDescription>
                                {
                                    "Depth flashcards focus narrowly on the subject matter, whereas breadth flashcards explore a wider range of related topics."
                                }
                            </DialogDescription>
                        </div>
                        <Tabs
                            id="range"
                            value={range}
                            onValueChange={(value) =>
                                (
                                    Object.values(FlashcardRange) as string[]
                                ).includes(value)
                                    ? setRange(value as FlashcardRange)
                                    : setRange(FlashcardRange.Balanced)
                            }
                        >
                            <TabsList>
                                <TabsTrigger value={FlashcardRange.Depth}>
                                    Depth
                                </TabsTrigger>
                                <TabsTrigger value={FlashcardRange.Breadth}>
                                    Breadth
                                </TabsTrigger>
                                <TabsTrigger value={FlashcardRange.Balanced}>
                                    Balanced
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={
                            generateFlashcardsMutation.isLoading &&
                            generationLock
                        }
                    >
                        {generateFlashcardsMutation.isLoading &&
                        generationLock ? (
                            <Loader varient="ring" colorWhite />
                        ) : (
                            "Generate"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
