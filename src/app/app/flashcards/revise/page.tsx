"use client";

import { trpc } from "@/src/app/utils/trpc";
import {
    Button,
    Card,
    H4,
    PageTitle,
    ScrollArea,
    ScrollBar,
} from "@/ui/components";
import FlashcardDialog from "@/ui/components/FlashcardDialog";
import FlashcardPreviewCard from "@/ui/components/FlashcardPreviewCard";
import { ItemForFlashcards } from "@/ui/components/ItemForFlashcards";
import { LoadingMessage } from "@/ui/components/LoadingMessage";
import RevisionSession from "@/ui/components/RevisionSession";
import {
    Collection,
    Flashcard,
    FlashcardReview,
    Item,
    Tag,
} from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Revise() {
    const router = useRouter();

    const itemsQuery = trpc.item.getUserItemsIncludeFlashcards.useQuery();
    const itemsWithFlashcards =
        itemsQuery.data?.filter((item) => item.flashcards.length > 0) ?? [];

    const revisionQueueQuery = trpc.flashcards.getUserRevisionQueue.useQuery();

    const [selectedFlashcard, setSelectedFlashcard] = useState<
        | (Flashcard & {
              item: Item & { collection: Collection; tags: Tag[] };
              reviews: FlashcardReview[];
          })
        | null
    >(null);

    const [isRevising, setIsRevising] = useState(false);

    if (isRevising && revisionQueueQuery.data) {
        return (
            <RevisionSession
                queue={revisionQueueQuery.data}
                onComplete={() => setIsRevising(false)}
            />
        );
    }

    return (
        <div className="flex flex-col">
            <PageTitle>Revise</PageTitle>
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
