"use client";

import { Range } from "@/src/datatypes/flashcard";
import { Experience, Finetuning } from "@/src/datatypes/summary";
import { Collection, Item, Tag } from "@prisma/client";
import { useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Tabs,
    TabsList,
    TabsTrigger,
} from ".";
import { trpc } from "../../src/app/utils/trpc";

interface SummariesDialogProps {
    data: Item & { collection: Collection; tags: Tag[] };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SummariesDialog({
    data,
    open,
    onOpenChange,
}: SummariesDialogProps) {
    const [numOfWords, setNumOfWords] = useState(250);
    const [experience, setExperience] = useState(Experience.Intermediate);
    const [finetuning, setFinetuning] = useState(Finetuning.Qualitative);

    const generateSummaryMutation = trpc.summary.generateSummary.useMutation({
        onSuccess(data) {
            console.log("Successfully generated summary:");
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
        // TODO: show toast notification: "Generating summary..."
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Flashcards</DialogTitle>
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
    const [experience, setExperience] = useState(Experience.Intermediate);
    const [range, setRange] = useState(Range.Balanced);

    const generateFlashcardsMutation =
        trpc.flashcards.generateFlashcards.useMutation({
            onSuccess(data) {
                console.log("Successfully generated flashcards:");

                console.log(data);
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Flashcards</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="numofflashcards">
                            Number of flashcards
                        </Label>
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
                        <Label htmlFor="range">range</Label>
                        <Tabs
                            id="range"
                            value={range.toString()}
                            onValueChange={(value) => setRange(parseInt(value))}
                        >
                            <TabsList>
                                <TabsTrigger value={Range.Depth.toString()}>
                                    Depth
                                </TabsTrigger>
                                <TabsTrigger value={Range.Breadth.toString()}>
                                    Breadth
                                </TabsTrigger>
                                <TabsTrigger value={Range.Balanced.toString()}>
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
