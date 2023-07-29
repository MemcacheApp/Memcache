"use client";

import { trpc } from "@/src/app/utils/trpc";
import {
    FlashcardExperienceNames,
    FlashcardRangeNames,
} from "@/src/datatypes/flashcard";
import {
    Button,
    CardHeader,
    CardTitle,
    PageTitle,
    SimpleItemCardFooter,
} from "@/ui/components";
import DueStatus from "@/ui/components/DueStatus";
import { Progress } from "@/ui/components/Progress";
import { cn } from "@/ui/utils";
import { useState } from "react";

export default function Review() {
    const flashcardsQuery = trpc.flashcards.getUserFlashcards.useQuery();

    const revisionQueue =
        flashcardsQuery.data?.sort(
            (a, b) => a.dueDate.valueOf() - b.dueDate.valueOf(),
        ) ?? [];

    const [currentFlashcard, setCurrentFlashcard] = useState<number>(0);

    // Evaluating flashcard review as easy, medium, hard, forgot
    const [evaluating, setEvaluating] = useState(false);

    const handleEvaluate = () => {
        setEvaluating(true);
    };

    const handleNextFlashcard = () => {
        setCurrentFlashcard((prev) =>
            Math.min(prev + 1, revisionQueue.length - 1),
        );
        setEvaluating(false);
        if (currentFlashcard >= revisionQueue.length) {
            return <div>No flashcards to review</div>;
        }
    };

    if (revisionQueue.length === 0) {
        return <div>No flashcards to review</div>;
    }

    return (
        <div className="flex flex-col">
            <PageTitle>Review Session</PageTitle>
            <div className="flex flex-col gap-5">
                <div className="bg-background mx-8 p-6 border rounded-lg">
                    <div
                        className={cn(
                            "group/flashcarddialog w-full relative border rounded-lg overflow-hidden aspect-[16/9]",
                        )}
                    >
                        <img
                            src={
                                revisionQueue[currentFlashcard].item
                                    .thumbnail ??
                                "https://www.maxpixel.net/static/photo/2x/Snow-Peaks-Ai-Generated-Artwork-Mountains-Forest-7903258.jpg"
                            }
                            alt="Image"
                            className="absolute object-cover object-center w-full h-full blur"
                        />
                        <div className="absolute w-full h-full text-slate-100/90 text-lg bg-black/50 shadow-[0_-32px_83px_-25px_rgba(0,0,0,0.65)_inset]">
                            <div className="flex flex-col items-center w-full h-full px-4 py-16 justify-evenly ">
                                <div
                                    className={cn(
                                        "px-4 pt-4 pb-3 w-[80%] max-w-[52rem] h-full grow text-xl text-center font-medium tracking-wide flex items-center",
                                    )}
                                >
                                    {revisionQueue[currentFlashcard].question}
                                </div>

                                <div
                                    className={cn(
                                        "px-4 py-2 h-full grow transition-[height,width,border-style,transform]",
                                        {
                                            "h-1 py-0 w-[45%] border-solid border-t-2":
                                                evaluating,
                                        },
                                    )}
                                >
                                    <button
                                        className={cn(
                                            "bg-slate-200/20 px-10 py-4 rounded-full hover:bg-slate-100/30",
                                            { "hidden ": evaluating },
                                        )}
                                        onClick={() => {
                                            setEvaluating(true);
                                            console.log("clicked");
                                        }}
                                    >
                                        Answer
                                    </button>
                                </div>
                                <div
                                    className={cn(
                                        "px-4 py-0 h-0 w-[90%] max-w-[56rem] opacity-0 text-center flex items-center transition-[height,opacity] overflow-y-hidden",
                                        {
                                            "h-full grow py-2 opacity-1":
                                                evaluating,
                                        },
                                    )}
                                >
                                    {revisionQueue[currentFlashcard].answer}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full ">
                        <div className="w-[70%] ">
                            <div className="flex flex-col justify-between w-full">
                                <div className="flex items-center justify-between py-1">
                                    <DueStatus
                                        dueDate={
                                            revisionQueue[currentFlashcard]
                                                .dueDate
                                        }
                                    />
                                    <div className="text-slate-500">
                                        Last revisited 3 days ago
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div className="px-1 mr-2 text-xl">
                                        {"65%"}
                                    </div>
                                    <Progress value={65} />
                                </div>
                                <div className="flex gap-2 py-1 text-sm text-slate-400/90">
                                    <span>
                                        {
                                            FlashcardExperienceNames[
                                                revisionQueue[currentFlashcard]
                                                    .experience
                                            ]
                                        }
                                    </span>
                                    <span>&#183;</span>
                                    <span>
                                        {
                                            FlashcardRangeNames[
                                                revisionQueue[currentFlashcard]
                                                    .range
                                            ]
                                        }
                                    </span>
                                </div>
                            </div>
                            <CardHeader className="px-0 overflow-y-hidden">
                                {revisionQueue[currentFlashcard].item.title ? (
                                    <CardTitle>
                                        {
                                            revisionQueue[currentFlashcard].item
                                                .title
                                        }
                                    </CardTitle>
                                ) : null}
                            </CardHeader>
                            <SimpleItemCardFooter
                                url={revisionQueue[currentFlashcard].item.url}
                                type={revisionQueue[currentFlashcard].item.type}
                                title={
                                    revisionQueue[currentFlashcard].item.title
                                }
                                collection={
                                    revisionQueue[currentFlashcard].item
                                        .collection
                                }
                                tags={revisionQueue[currentFlashcard].item.tags}
                                description={
                                    revisionQueue[currentFlashcard].item
                                        .description
                                }
                                thumbnail={
                                    revisionQueue[currentFlashcard].item
                                        .thumbnail
                                }
                                siteName={
                                    revisionQueue[currentFlashcard].item
                                        .siteName
                                }
                                favicon={
                                    revisionQueue[currentFlashcard].item.favicon
                                }
                                className="px-0"
                            />
                        </div>
                        <div className="ml-[2.5rem] flex flex-col gap-2">
                            <div className="text-easy">
                                <span className="font-mono text-3xl font-bold">
                                    1
                                </span>
                                <span className="ml-2">easy</span>
                            </div>
                            <div className="text-medium">
                                <span className="font-mono text-3xl font-bold">
                                    4
                                </span>
                                <span className="ml-2">medium</span>
                            </div>
                            <div className="text-hard">
                                <span className="font-mono text-3xl font-bold">
                                    3
                                </span>
                                <span className="ml-2">hard</span>
                            </div>
                            <div className="text-forgot">
                                <span className="font-mono text-3xl font-bold">
                                    2
                                </span>
                                <span className="ml-2">forgot</span>
                            </div>
                        </div>
                    </div>
                    {evaluating ? (
                        <div className="flex justify-between">
                            <Button
                                onClick={() =>
                                    setCurrentFlashcard((prev) =>
                                        Math.max(prev - 1, 0),
                                    )
                                }
                            >
                                Previous
                            </Button>
                            <Button onClick={handleNextFlashcard}>Next</Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
