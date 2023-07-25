"use client";

import { trpc } from "@/src/app/utils/trpc";
import { P, PageTitle } from "@/ui/components";

interface FlashcardSetPageProps {
    params: {
        id: string;
    };
}

export default function FlashcardSetPage({ params }: FlashcardSetPageProps) {
    const itemQuery = trpc.item.getFlashcards.useQuery({
        itemId: params.id,
    });
    const data = itemQuery.data;

    return (
        <div className="flex flex-col">
            <PageTitle>Flashcards for {data?.title} </PageTitle>
            <div className="mx-8">
                <P>ID: {params.id}</P>
                <P className="whitespace-pre-line">
                    {data?.flashcards.map((flashcard) => (
                        <div key={flashcard.id}>{flashcard.question}</div>
                    ))}
                </P>
            </div>
        </div>
    );
}
