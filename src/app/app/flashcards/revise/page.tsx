"use client";

import { trpc } from "@/src/app/utils/trpc";
import { ItemExt } from "@/src/datatypes/item";
import {
    Button,
    Card,
    H4,
    PageTitle,
    ScrollArea,
    ScrollBar,
} from "@/ui/components";
import { Duration } from "@/ui/components/Duration";
import FlashcardDialog from "@/ui/components/FlashcardDialog";
import FlashcardPreviewCard from "@/ui/components/FlashcardPreviewCard";
import { ItemForFlashcards } from "@/ui/components/ItemForFlashcards";
import { LoadingMessage } from "@/ui/components/LoadingMessage";
import { ReviewRatingsDoughnut } from "@/ui/components/ReviewRatingsDoughnut";
import RevisionSession from "@/ui/components/RevisionSession";
import {
    Flashcard,
    FlashcardReview,
    FlashcardReviewRating,
} from "@prisma/client";
import { intervalToDuration } from "date-fns";
import { BarChart4, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Revise() {
    const ctx = trpc.useContext();

    const router = useRouter();

    const itemsQuery = trpc.item.getUserItemsIncludeFlashcards.useQuery();
    const itemsWithFlashcards =
        itemsQuery.data?.filter((item) => item.flashcards.length > 0) ?? [];

    const userFlashcardsQuery = trpc.flashcards.getUserFlashcards.useQuery();

    const revisionQueueQuery = trpc.flashcards.getUserRevisionQueue.useQuery();
    revisionQueueQuery.data?.forEach((flashcard) => {
        console.log(flashcard.dueDate);
    });

    const totalReviewTime =
        userFlashcardsQuery.data?.reduce((totalTime, flashcard) => {
            totalTime += flashcard.reviews.reduce((time, review) => {
                const reviewDuration = intervalToDuration({
                    start: review.start,
                    end: review.end,
                });
                if (reviewDuration) {
                    return (
                        time +
                        (reviewDuration.seconds ?? 0) +
                        (reviewDuration.minutes ?? 0) * 60 +
                        (reviewDuration.hours ?? 0) * 3600 +
                        (reviewDuration.days ?? 0) * 86400 +
                        (reviewDuration.months ?? 0) * 2592000 +
                        (reviewDuration.years ?? 0) * 31536000
                    );
                } else {
                    return time;
                }
            }, 0);
            return totalTime;
        }, 0) ?? 0;
    console.log(`Total time reviewed: ${totalReviewTime}`);

    const ratingsCount = userFlashcardsQuery.data?.reduce(
        (total, flashcard) => {
            for (const review of flashcard.reviews) {
                const rating = review.rating;
                total[rating] += 1;
            }
            return total;
        },
        {
            [FlashcardReviewRating.Easy]: 0,
            [FlashcardReviewRating.Medium]: 0,
            [FlashcardReviewRating.Hard]: 0,
            [FlashcardReviewRating.Forgot]: 0,
        },
    ) ?? {
        [FlashcardReviewRating.Easy]: 0,
        [FlashcardReviewRating.Medium]: 0,
        [FlashcardReviewRating.Hard]: 0,
        [FlashcardReviewRating.Forgot]: 0,
    };
    console.log(`Ratings count: ${ratingsCount}`);

    const handleCompleteRevisionSession = () => {
        ctx.item.getUserItemsIncludeFlashcards.invalidate();
        ctx.flashcards.getUserFlashcards.invalidate();
        ctx.flashcards.getUserRecentlyReviewed.invalidate();
        ctx.flashcards.getUserRevisionQueue.invalidate();
        setIsRevising(false);
    };

    const [selectedFlashcard, setSelectedFlashcard] = useState<
        | (Flashcard & {
              item: ItemExt;
              reviews: FlashcardReview[];
          })
        | null
    >(null);

    const [isRevising, setIsRevising] = useState(false);

    if (isRevising && revisionQueueQuery.data) {
        return (
            <RevisionSession
                queue={revisionQueueQuery.data}
                onComplete={handleCompleteRevisionSession}
            />
        );
    }

    return (
        <div className="flex flex-col">
            <PageTitle>Revise</PageTitle>
            <Card className="p-6 mx-8 rounded-lg">
                {userFlashcardsQuery.isLoading ? (
                    <LoadingMessage message={"Loading flashcards..."} />
                ) : (
                    <div className="flex justify-between gap-5 p-6 ">
                        <div className="flex flex-col gap-8 w-full @container/leftStats">
                            <Button
                                className="group/backToFlashcards w-[200px]"
                                onClick={() => {
                                    router.push("/app/flashcards");
                                }}
                            >
                                <ChevronLeft className="relative right-0 group-hover/backToFlashcards:right-2 transition-right" />
                                Back to flashcards
                            </Button>
                            <div className="grid grid-cols-1 @sm/leftStats:grid-cols-2 gap-5 @sm/leftStats:gap-9 @lg/leftStats:gap-12">
                                <div className="flex gap-3 items-center">
                                    <BarChart4 size={36} />
                                    <span className="text-6xl font-semibold">
                                        {userFlashcardsQuery.data?.reduce(
                                            (total, flashcard) =>
                                                total +
                                                flashcard.reviews.length,
                                            0,
                                        )}
                                    </span>
                                    <div className="grid grid-cols-1">
                                        <span className="leading-[1.2rem]">
                                            review
                                        </span>
                                        <span className="leading-[1.2rem]">
                                            count
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <Duration
                                        time={totalReviewTime}
                                        iconSize={36}
                                        className="gap-3"
                                        textNumSize="text-6xl"
                                        textUnitsSize="text-lg"
                                    />
                                    <div className="grid grid-cols-1">
                                        <span className="leading-[1.2rem]">
                                            time spent
                                        </span>
                                        <span className="leading-[1.2rem]">
                                            reviewing
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <Layers size={32} />
                                    <span className="text-4xl font-bold">
                                        {userFlashcardsQuery.data?.length ?? 0}
                                    </span>
                                    <div className="grid grid-cols-1">
                                        <span className="leading-[1rem] text-sm">
                                            flashcards
                                        </span>
                                        <span className="leading-[1rem] text-sm">
                                            created
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <Layers size={32} />
                                    <span className="text-4xl font-bold">
                                        {userFlashcardsQuery.data?.filter(
                                            (flashcard) =>
                                                flashcard.reviews.length > 0,
                                        ).length ?? 0}
                                    </span>
                                    <div className="grid grid-cols-1">
                                        <span className="leading-[1rem] text-sm">
                                            flashcards
                                        </span>
                                        <span className="leading-[1rem] text-sm">
                                            reviewed
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ml-[2.5rem] flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-4 justify-items-center mb-3">
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
                )}
            </Card>
            <Card className="p-6 mx-8 rounded-lg">
                <div className="flex justify-between mb-2">
                    <H4>Revision Queue</H4>
                    <div>
                        <Button
                            className="group/startRevSess"
                            onClick={() => {
                                setIsRevising(true);
                            }}
                            size="lg"
                        >
                            Start Revision Session&nbsp;
                            <ChevronRight className="relative left-0 group-hover/startRevSess:left-2 transition-left" />
                        </Button>
                    </div>
                </div>
                {revisionQueueQuery.isLoading ? (
                    <LoadingMessage message={"Loading revision queue..."} />
                ) : (
                    <ScrollArea
                        type="scroll"
                        className="border rounded-lg shadow-[inset_0_0_5px_-2px_rgba(0,0,0,0.2)]"
                    >
                        <div className="flex gap-3 p-3">
                            {revisionQueueQuery.data &&
                            revisionQueueQuery.data.length > 0 ? (
                                revisionQueueQuery.data.map((flashcard) => (
                                    <FlashcardPreviewCard
                                        key={flashcard.id}
                                        data={flashcard}
                                        onClick={() =>
                                            setSelectedFlashcard(flashcard)
                                        }
                                        className="shadow-[0_0_5px_-1px_rgba(0,0,0,0.3)]"
                                    />
                                ))
                            ) : (
                                <div className="flex justify-center items-center w-full h-[180px]">
                                    No flashcards due for review
                                </div>
                            )}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                )}
                <H4 className="mt-5">Items with Flashcards</H4>
                <ScrollArea
                    type="scroll"
                    className="border rounded-lg shadow-[inset_0_0_5px_-2px_rgba(0,0,0,0.2)]"
                >
                    <div className="flex gap-3 p-3">
                        {itemsWithFlashcards.length > 0 ? (
                            itemsWithFlashcards.map((item) => (
                                <ItemForFlashcards
                                    key={item.id}
                                    className="w-[25rem] h-[38rem] max-h-[50vh] shadow-[0_0_5px_-1px_rgba(0,0,0,0.3)]"
                                    data={item}
                                    selected={false}
                                    onSelect={(id: string) => {
                                        router.push(`/app/flashcards/${id}`);
                                    }}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col gap-4 justify-center items-center w-full h-[180px]">
                                No items with flashcards. Create some flashcards
                                to get started!
                                <Button
                                    onClick={() =>
                                        router.push("/app/flashcards")
                                    }
                                >
                                    Generate Flashcards
                                </Button>
                            </div>
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
