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
                            {getItemSummariesQuery.data.map((summary) => (
                                <SummaryCard
                                    key={summary.id}
                                    item={data}
                                    summary={summary}
                                />
                            ))}
                            <Button
                                variant="outline"
                                onClick={handleNewSummary}
                            >
                                <PlusIcon className="mr-2" size={16} /> Generate
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
    data: Item & { collection: Collection; tags: Tag[] };
    open: boolean;
    onOpenChange: (open: boolean) => void;
    viewSummaries: () => void;
}

export function GenerateSummaryDialog({
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
interface FlashcardsDialogProps {
    data: Item & { collection: Collection; tags: Tag[] };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FlashcardsDialog({
    data,
    open,
    onOpenChange,
}: FlashcardsDialogProps) {
    const [numOfFlashcards, setNumOfFlashcards] = useState(3);
    const [experience, setExperience] = useState<FlashcardExperience>(
        FlashcardExperience.Intermediate,
    );
    const [range, setRange] = useState<FlashcardRange>(FlashcardRange.Balanced);

    const ctx = trpc.useContext();

    const generateFlashcardsMutation =
        trpc.flashcards.generateFlashcards.useMutation({
            onSuccess(data) {
                console.log("Successfully generated flashcards:");
                console.log(data);
                ctx.flashcards.getUserFlashcards.invalidate();
                ctx.item.getUserItemsWithFlashcards.invalidate();
            },
            onError: (err) => {
                console.error(err);
            },
        });

    const handleSubmit = () => {
        generateFlashcardsMutation.mutate({
            itemId: data.id,
            numOfFlashcards,
            experience,
            range,
        });
        // TODO: show toast notification: "Generating flashcards..."
        onOpenChange(false);
    };

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
                    <Button onClick={handleSubmit}>Generate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
