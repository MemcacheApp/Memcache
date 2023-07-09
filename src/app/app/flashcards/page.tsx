"use client";

import { Button } from "@/ui/components";
import { PageTitle } from "../../../../ui/components/typography";
import { trpc } from "@/src/app/utils/trpc";

export default function FlashcardsPage() {
    const flashcardsQuery = trpc.flashcards.generateFlashcards.useQuery();
    const flashcardsData = flashcardsQuery.data?.flashcards;

    const generateFlashcards = () => {
        flashcardsQuery.refetch();
    };

    return (
        <div className="flex flex-col">
            <PageTitle>Flashcards</PageTitle>
            <p>{`Prompt: "Recently I've picked up a new hobby: I'm learning to fly light aircraft and I find it very fun and interesting. However I have a lot to learn."`}</p>
            <p>{`(please don't click this too much lol it cost money)`}</p>
            <div className="w-48 my-4">
                <Button size={"lg"} onClick={generateFlashcards}>
                    Generate
                </Button>
            </div>
            {flashcardsData?.map((flashcard) => (
                <div className="px-4 my-4" key={flashcard.id}>
                    {flashcard.content}
                </div>
            ))}
        </div>
    );
}
