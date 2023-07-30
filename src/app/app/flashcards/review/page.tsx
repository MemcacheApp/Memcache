"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Button, PageTitle } from "@/ui/components";
import FlashcardQA from "@/ui/components/FlashcardQA";
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
                <div className="bg-background mx-8 p-6 border rounded-lg flex flex-col gap-3">
                    <FlashcardQA
                        flashcard={revisionQueue[currentFlashcard]}
                        showAnswer={evaluating}
                        setShowAnswer={setEvaluating}
                    />
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
