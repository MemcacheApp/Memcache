"use client";

import { trpc } from "@/src/app/utils/trpc";
import { ItemExt } from "@/src/datatypes/item";
import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    H4,
    PageTitle,
    ScrollArea,
    ScrollBar,
    Separator,
} from "@/ui/components";
import { Duration } from "@/ui/components/Duration";
import FlashcardReviewCard from "@/ui/components/FlashcardReviewCard";
import { ReviewRatingsHorizontalBarSingle } from "@/ui/components/ReviewRatingsHorizontalBarSingle";
import {
    Flashcard,
    FlashcardReview,
    FlashcardReviewRating,
} from "@prisma/client";
import { ChevronLeft, Layers, SkipForward, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import FlashcardDialog from "./FlashcardDialog";
import FlashcardPreviewCard from "./FlashcardPreviewCard";
import { LoadingMessage } from "./LoadingMessage";
import { ReviewRatingsDoughnut } from "./ReviewRatingsDoughnut";

export default function RevisionSession({
    queue,
    onComplete,
}: {
    queue: (Flashcard & {
        item: ItemExt;
        reviews: FlashcardReview[];
    })[];
    onComplete: () => void;
}) {
    const ctx = trpc.useContext();
    const [currentFlashcard, setCurrentFlashcard] = useState<number>(0);
    const [skipped, setSkipped] = useState<number[]>([]);
    const reviewedFlashcardsQuery =
        trpc.flashcards.getUserFlashcardsById.useQuery(
            queue
                .map((flashcard) => flashcard.id)
                .slice(0, currentFlashcard)
                .filter(
                    (id) =>
                        !skipped.includes(
                            queue.findIndex((flashcard) => flashcard.id === id),
                        ),
                ),
        );

    const [ratingsCount, setRatingsCount] = useState<{
        [key in FlashcardReviewRating]: number;
    }>(
        (
            Object.keys(FlashcardReviewRating) as Array<
                keyof typeof FlashcardReviewRating
            >
        ).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {} as { [key in FlashcardReviewRating]: number }),
    );

    // duration of revision session as a unix timestamp (seconds since epoch)
    const [time, setTime] = useState<number>(0);
    // Use this NodeJS.Timer object to stop the timer when the revision session is completed
    const [intervalObj, setIntervalObj] = useState<NodeJS.Timer | null>(null);

    const [selectedFlashcard, setSelectedFlashcard] = useState<
        | (Flashcard & {
              item: ItemExt;
              reviews: FlashcardReview[];
          })
        | null
    >(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => (prev ?? 0) + 1);
        }, 1000);
        setIntervalObj(interval);
        return () => clearInterval(interval);
    }, []);

    const handleSubmitReview = (rating: FlashcardReviewRating) => {
        setRatingsCount((prev) => {
            return {
                ...prev,
                [rating]: prev[rating] + 1,
            };
        });
    };

    const handleNextFlashcard = () => {
        setCurrentFlashcard((prev) => Math.min(prev + 1, queue.length));
    };

    const handleSkip = () => {
        setSkipped((prev) => [...prev, currentFlashcard]);
        handleNextFlashcard();
    };

    const handleSkipToEnd = () => {
        setSkipped((prev) => [
            ...prev,
            ...Array(queue.length - currentFlashcard)
                .fill(0)
                .map((_, i) => currentFlashcard + i),
        ]); // All indexes from currentFlashcard to queue.length - 1
        setCurrentFlashcard(queue.length);
    };

    if (queue.length === 0) {
        return (
            <div className="flex flex-col h-full">
                <PageTitle>Revision Session</PageTitle>
                <div className="h-full flex flex-col gap-11 justify-center items-center">
                    <div>
                        You are all up to date! Check back later to continue
                        reviewing more flashcards.
                    </div>
                    <Button onClick={onComplete}>Back to flashcards</Button>
                </div>
            </div>
        );
    }

    if (currentFlashcard >= queue.length) {
        intervalObj && clearInterval(intervalObj);

        ctx.flashcards.getUserFlashcardsById.invalidate();

        return (
            <div className="flex flex-col">
                <PageTitle>Revision Session</PageTitle>
                <Card className="p-6 mx-8 rounded-lg">
                    <div className="flex justify-around gap-5 mb-8">
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-3">
                                <Button
                                    className="group/backToFlashcards"
                                    onClick={onComplete}
                                >
                                    <ChevronLeft className="relative right-0 group-hover/backToFlashcards:right-2 transition-right" />
                                    Back to flashcards
                                </Button>
                                <div>Revision session completed!</div>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Layers size={36} />
                                <span className="text-6xl font-bold">
                                    {currentFlashcard - skipped.length}
                                </span>
                                <div className="grid grid-cols-1">
                                    <span className="leading-[1.2rem]">
                                        flashcards
                                    </span>
                                    <span className="leading-[1.2rem]">
                                        reviewed
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3 items-center">
                                <SkipForward size={32} />
                                <span className="text-4xl font-semibold">
                                    {skipped.length}
                                </span>
                                <div className="grid grid-cols-1">
                                    <span className="leading-[1rem] text-sm">
                                        flashcards
                                    </span>
                                    <span className="leading-[1rem] text-sm">
                                        skipped
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Duration
                                    time={time}
                                    iconSize={32}
                                    className="gap-3"
                                    textNumSize="text-4xl"
                                    textUnitsSize="text-lg"
                                />
                                <div className="grid grid-cols-1">
                                    <span className="leading-[1rem] text-sm">
                                        time
                                    </span>
                                    <span className="leading-[1rem] text-sm">
                                        elapsed
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="ml-[2.5rem] ">
                            <div className="grid grid-cols-2 gap-2 justify-items-center mb-3">
                                <div className="text-easy">
                                    <span className="font-mono text-3xl font-bold">
                                        {
                                            ratingsCount[
                                                FlashcardReviewRating.Easy
                                            ]
                                        }
                                    </span>
                                    <span className="ml-2">easy</span>
                                </div>
                                <div className="text-medium">
                                    <span className="font-mono text-3xl font-bold">
                                        {
                                            ratingsCount[
                                                FlashcardReviewRating.Medium
                                            ]
                                        }
                                    </span>
                                    <span className="ml-2">medium</span>
                                </div>
                                <div className="text-hard">
                                    <span className="font-mono text-3xl font-bold">
                                        {
                                            ratingsCount[
                                                FlashcardReviewRating.Hard
                                            ]
                                        }
                                    </span>
                                    <span className="ml-2">hard</span>
                                </div>
                                <div className="text-forgot">
                                    <span className="font-mono text-3xl font-bold">
                                        {
                                            ratingsCount[
                                                FlashcardReviewRating.Forgot
                                            ]
                                        }
                                    </span>
                                    <span className="ml-2">forgot</span>
                                </div>
                            </div>
                            <ReviewRatingsDoughnut
                                ratingsCount={ratingsCount}
                            />
                        </div>
                    </div>
                    <H4>Reviewed this session</H4>
                    <ScrollArea
                        type="scroll"
                        className="border rounded-lg shadow-[inset_0_0_5px_-2px_rgba(0,0,0,0.2)]"
                    >
                        <div className="flex gap-3 p-3">
                            {reviewedFlashcardsQuery.data ? (
                                reviewedFlashcardsQuery.data.map(
                                    (flashcard) => (
                                        <FlashcardPreviewCard
                                            key={flashcard.id}
                                            data={flashcard}
                                            onClick={() =>
                                                setSelectedFlashcard(flashcard)
                                            }
                                            className="shadow-[0_0_5px_-1px_rgba(0,0,0,0.3)]"
                                        />
                                    ),
                                )
                            ) : (
                                <LoadingMessage message="Loading reviewed flashcards from this session..." />
                            )}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </Card>
                {selectedFlashcard && (
                    <FlashcardDialog
                        flashcard={selectedFlashcard}
                        open={selectedFlashcard !== null}
                        onOpenChange={(value) => {
                            if (!value) {
                                setSelectedFlashcard(null);
                            }
                        }}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <PageTitle>Revision Session</PageTitle>
            <div className="flex flex-col gap-5 mx-8">
                <Card>
                    <CardHeader>
                        <div className="flex gap-5 items-end">
                            <div className="grid grid-cols-1 text-slate-500">
                                <span className="leading-[1.2rem]">
                                    Current
                                </span>
                                <span className="leading-[1.2rem]">
                                    Session
                                </span>
                            </div>
                            <div className="text-4xl font-extrabold tracking-widest">{`${
                                currentFlashcard - skipped.length
                            }/${queue.length - skipped.length}`}</div>
                            <ReviewRatingsHorizontalBarSingle
                                ratingsCount={ratingsCount}
                            />
                            <Duration time={time} className="ml-auto" />
                            <Button onClick={handleSkip}>
                                Skip
                                <SkipForward size={16} className="ml-2" />
                            </Button>
                            <Button onClick={handleSkipToEnd}>
                                Quit
                                <XCircle size={16} className="ml-2" />
                            </Button>
                        </div>
                    </CardHeader>
                    <Separator className="my-6" />
                    <CardFooter>
                        <FlashcardReviewCard
                            flashcard={queue[currentFlashcard]}
                            onSubmit={handleSubmitReview}
                            onNext={handleNextFlashcard}
                        />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
