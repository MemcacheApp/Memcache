"use client";

import {
    Button,
    Card,
    ItemCard,
    ItemSelector,
    LogInRequired,
    ScrollArea,
    ScrollBar,
} from "@/ui/components";
import FlashcardDialog from "@/ui/components/FlashcardDialog";
import FlashcardPreviewCard from "@/ui/components/FlashcardPreviewCard";
import { GenerateFlashcardsDialog } from "@/ui/components/GenerationDialog";
import { LoadingMessage } from "@/ui/components/LoadingMessage";
import { H4 } from "@/ui/components/typography";
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
import { H3, PageTitle } from "../../../../ui/components/typography";
import { trpc } from "../../utils/trpc";

export default function FlashcardsPage() {
    const router = useRouter();

    const recentlyCreatedQuery =
        trpc.flashcards.getUserRecentlyCreated.useQuery();
    const recentlyCreated = recentlyCreatedQuery.data ?? [];

    const recentlyReviewedQuery =
        trpc.flashcards.getUserRecentlyReviewed.useQuery();
    const recentlyReviewed = recentlyReviewedQuery.data ?? [];

    const suggestedItemsQuery = trpc.flashcards.getSuggestedItems.useQuery();

    const [selectedItem, setSelectedItem] = useState<
        (Item & { collection: Collection; tags: Tag[] }) | null
    >(null);

    const onSelectItem = (
        item: Item & { collection: Collection; tags: Tag[] },
    ) => {
        setSelectedItem(item);
    };

    const [selectedFlashcard, setSelectedFlashcard] = useState<
        | (Flashcard & {
              item: Item & { collection: Collection; tags: Tag[] };
              reviews: FlashcardReview[];
          })
        | null
    >(null);

    return (
        <div className="flex flex-col gap-5">
            <LogInRequired>
                <PageTitle>Flashcards</PageTitle>

                <Card className="p-6 mx-8 rounded-lg">
                    <H3>My Flashcards</H3>
                    <div className="w-full h-24 flex flex-col justify-center items-center gap-3">
                        <Button
                            className="group/revise"
                            onClick={() =>
                                router.push("/app/flashcards/revise")
                            }
                            size="lg"
                        >
                            Revise Flashcards&nbsp;
                            <ChevronRight className="relative left-0 group-hover/revise:left-2 transition-left" />
                        </Button>
                    </div>

                    <H4 className="mt-3">Recently Created</H4>
                    {recentlyCreatedQuery.isLoading ? (
                        <LoadingMessage
                            message={"Loading recently created flashcards..."}
                        />
                    ) : (
                        <ScrollArea
                            type="scroll"
                            className="border rounded-lg shadow-[inset_0_0_5px_-2px_rgba(0,0,0,0.2)]"
                        >
                            <div className="flex gap-3 p-3">
                                {recentlyCreated?.length > 0 ? (
                                    recentlyCreated?.map((flashcard) => (
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
                                        No recently created flashcards
                                    </div>
                                )}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}

                    <H4 className="mt-3">Recently Reviewed</H4>
                    {recentlyReviewedQuery.isLoading ? (
                        <LoadingMessage message="Loading recently reviewed flashcards..." />
                    ) : (
                        <ScrollArea
                            type="scroll"
                            className="border rounded-lg shadow-[inset_0_0_5px_-2px_rgba(0,0,0,0.2)]"
                        >
                            <div className="flex gap-3 p-3">
                                {recentlyReviewed?.length > 0 ? (
                                    recentlyReviewed?.map((flashcard) => (
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
                                        No recently reviewed flashcards
                                    </div>
                                )}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}
                </Card>
                <Card className="p-6 mx-8 rounded-lg">
                    <H3>Generate Flashards</H3>

                    <ItemSelector
                        className="w-full text-base font-normal text-slate-500"
                        onSelect={onSelectItem}
                    />
                    <div className="flex flex-col mt-5">
                        <H4 className="mb-2">Suggested Items</H4>
                        <p className="text-sm text-slate-500 mb-4">
                            Items suggested for generating flashcards based on
                            recently added items, number of existing flashcards,
                            item type and other factors.
                        </p>
                        {suggestedItemsQuery.isLoading ? (
                            <LoadingMessage
                                message={"Loading suggested items..."}
                            />
                        ) : (
                            <ScrollArea
                                type="scroll"
                                className="border rounded-lg shadow-[inset_0_0_5px_-2px_rgba(0,0,0,0.2)]"
                            >
                                <div className="flex gap-3 p-3">
                                    {(suggestedItemsQuery.data ?? []).map(
                                        (item) => (
                                            <ItemCard
                                                key={item.id}
                                                className="w-[25rem] h-[30rem] max-h-[50vh] shadow-[0_0_5px_-1px_rgba(0,0,0,0.3)]"
                                                data={item}
                                                selected={
                                                    selectedItem?.id === item.id
                                                }
                                                onSelect={() =>
                                                    setSelectedItem(item)
                                                }
                                                hideOptions
                                                format={{
                                                    growHeight: true,
                                                }}
                                            />
                                        ),
                                    )}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        )}
                    </div>
                </Card>
                <FlashcardDialog
                    flashcard={selectedFlashcard}
                    open={selectedFlashcard !== null}
                    onOpenChange={(value) => {
                        if (!value) {
                            setSelectedFlashcard(null);
                        }
                    }}
                />
                <GenerateFlashcardsDialog
                    data={selectedItem}
                    open={selectedItem !== null}
                    onOpenChange={(value: boolean) => {
                        if (!value) {
                            setSelectedItem(null);
                        }
                    }}
                />
            </LogInRequired>
        </div>
    );
}

// interface ThumbnailProps {
//     type: string | undefined;
//     loading: boolean | undefined;
//     thumbnail: string | undefined | null;
// }

// function Thumbnail(props: ThumbnailProps) {
//     if (props.loading) {
//         return (
//             <Skeleton className="order-1 @lg:order-2 @lg:max-w-[32%] max-h-64 @lg:max-h-48 aspect-[16/9] @lg:m-6 shrink-0 @lg:border rounded-t-lg overflow-hidden" />
//         );
//     } else if (props.thumbnail) {
//         return (
//             <div
//                 className={cn(
//                     "order-1 @lg:order-2 @lg:max-w-[32%] max-h-64 @lg:max-h-48 @lg:m-6 shrink-0 border rounded-t-lg @lg:rounded-lg overflow-hidden",
//                     props.type?.startsWith("music")
//                         ? "aspect-square"
//                         : "aspect-[16/9]",
//                 )}
//             >
//                 <img
//                     src={props.thumbnail}
//                     alt="Image"
//                     className="relative object-cover object-center w-full h-full"
//                 />
//             </div>
//         );
//     } else {
//         return null;
//     }
// }
