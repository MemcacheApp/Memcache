"use client";

import { trpc } from "@/src/app/utils/trpc";
import { PageTitle } from "@/ui/components";
import FlashcardReview from "@/ui/components/FlashcardReview";
import { useState } from "react";

export default function Review() {
    const revisionQueueQuery = trpc.flashcards.getUserRevisionQueue.useQuery();
    const revisionQueue = revisionQueueQuery.data ?? [];

    const [currentFlashcard, setCurrentFlashcard] = useState<number>(0);

    const handleNextFlashcard = () => {
        setCurrentFlashcard((prev) => Math.min(prev + 1, revisionQueue.length));
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
                <div className="bg-background mx-8 p-6 border rounded-lg flex flex-col gap-3">
                    <FlashcardReview
                        flashcard={revisionQueue[currentFlashcard]}
                        onNext={handleNextFlashcard}
                    />
                </div>
            </div>
        </div>
    );
}
