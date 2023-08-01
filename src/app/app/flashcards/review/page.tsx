"use client";

import { trpc } from "@/src/app/utils/trpc";
import {
    Card,
    CardFooter,
    CardHeader,
    PageTitle,
    Separator,
} from "@/ui/components";
import Duration from "@/ui/components/Duration";
import FlashcardReviewCard from "@/ui/components/FlashcardReviewCard";
import { HorizontalBarSingle } from "@/ui/components/ReviewRatingsHorizontalBarSingle";
import { FlashcardReviewRating } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Review() {
    const revisionQueueQuery = trpc.flashcards.getUserRevisionQueue.useQuery();
    const revisionQueue = revisionQueueQuery.data ?? [];

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
        setCurrentFlashcard((prev) => Math.min(prev + 1, revisionQueue.length));
    };

    if (currentFlashcard >= revisionQueue.length) {
        return <div>No flashcards to review</div>;
    }

    if (revisionQueue.length === 0) {
        return <div>No flashcards to review</div>;
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
                            <div className="text-4xl font-extrabold tracking-widest">{`${currentFlashcard}/${revisionQueue.length}`}</div>
                            <HorizontalBarSingle ratingsCount={ratingsCount} />
                            <Duration time={time} />
                        </div>
                    </CardHeader>
                    <Separator className="my-6" />
                    <CardFooter>
                        <FlashcardReviewCard
                            flashcard={revisionQueue[currentFlashcard]}
                            onSubmit={handleSubmitReview}
                            onNext={handleNextFlashcard}
                        />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
