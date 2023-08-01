"use client";

import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    PageTitle,
    Separator,
} from "@/ui/components";
import { Duration } from "@/ui/components/Duration";
import FlashcardReviewCard from "@/ui/components/FlashcardReviewCard";
import { HorizontalBarSingle } from "@/ui/components/ReviewRatingsHorizontalBarSingle";
import {
    Collection,
    Flashcard,
    FlashcardReview,
    FlashcardReviewRating,
    Item,
    Tag,
} from "@prisma/client";
import { useEffect, useState } from "react";

export default function RevisionSession({
    queue,
    onComplete,
}: {
    queue: (Flashcard & {
        item: Item & { collection: Collection; tags: Tag[] };
        reviews: FlashcardReview[];
    })[];
    onComplete: () => void;
}) {
    const [currentFlashcard, setCurrentFlashcard] = useState<number>(0);
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

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => (prev ?? 0) + 1);
        }, 1000);
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

    // if (revisionQueueQuery.isLoading) {
    //     return (
    //         <div className="flex flex-col h-full">
    //             <PageTitle>Revision Session</PageTitle>
    //             <div className="h-full flex flex-col gap-11 justify-center items-center">
    //                 <Loader varient="ellipsis" />
    //                 <div>Loading revision session...</div>
    //             </div>
    //         </div>
    //     );
    // }

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
        return (
            <div className="h-full flex flex-col gap-11 justify-center items-center">
                <div>Revision session completed!</div>
                <Button onClick={onComplete}>Back to flashcards</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <PageTitle>Revision Session</PageTitle>
            <div className="flex flex-col gap-5 mx-8">
                {/* <div className="bg-background mx-8 p-6 border rounded-lg flex flex-col gap-3"> */}
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
                            <div className="text-4xl font-extrabold tracking-widest">{`${currentFlashcard}/${queue.length}`}</div>
                            <HorizontalBarSingle ratingsCount={ratingsCount} />
                            <Duration time={time} className="ml-auto" />
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
