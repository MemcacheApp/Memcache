"use client";

import {
    Button,
    Card,
    Input,
    ItemCard,
    Link,
    ScrollArea,
    ScrollBar,
} from "@/ui/components";
import FlashcardDialog from "@/ui/components/FlashcardDialog";
import FlashcardPreviewCard from "@/ui/components/FlashcardPreviewCard";
import { FlashcardsDialog } from "@/ui/components/GenerationDialog";
import { ItemForFlashcards } from "@/ui/components/ItemForFlashcards";
import { H4 } from "@/ui/components/typography";
import { Collection, Flashcard, Item, Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { H3, PageTitle } from "../../../../ui/components/typography";
import { trpc } from "../../utils/trpc";

function FlashcardSearchResult({
    item,
}: {
    item: Item & { tags: Tag[]; collection: Collection };
}) {
    const [isOpenFlashcards, setIsOpenFlashcards] = useState(false);

    return (
        <>
            <div
                key={item.id}
                onClick={() => setIsOpenFlashcards(true)}
                className="flex justify-between h-24 px-2 py-3 rounded-md hover:bg-slate-100"
            >
                <div className="flex flex-col justify-between">
                    <div className="flex">
                        <h3 className="mr-2 text-lg font-semibold leading-6 tracking-tight">
                            {item.title}
                        </h3>
                        {/* <ExternalLink /> */}
                    </div>
                    <div>
                        {item.tags.map((tag: Tag) => {
                            return (
                                <div key={tag.id}>
                                    <Link
                                        className="flex items-center px-3 py-1.5 rounded-lg hover:no-underline hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border shadow-sm w-fit"
                                        href={`/app/tag/${tag.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {tag.name}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {item.thumbnail ? (
                    <img
                        src={item.thumbnail}
                        alt="Image"
                        className="rounded-sm w-36"
                    />
                ) : (
                    ""
                )}
            </div>
            <FlashcardsDialog
                data={item}
                open={isOpenFlashcards}
                onOpenChange={setIsOpenFlashcards}
            />
        </>
    );
}

export default function FlashcardsPage() {
    const router = useRouter();

    const [itemInput, setItemInput] = useState("");
    const itemsQuery = trpc.item.getUserItemsWithFlashcards.useQuery();
    const flashcardsQuery = trpc.flashcards.getUserFlashcards.useQuery();

    const revisionQueue =
        flashcardsQuery.data?.sort(
            (a, b) => a.dueDate.valueOf() - b.dueDate.valueOf(),
        ) ?? [];

    const recentlyViewed = flashcardsQuery.data?.sort((a, b) =>
        a.reviews.length > 0 && b.reviews.length > 0
            ? b.reviews.slice(-1)[0].timestamp.valueOf() -
              a.reviews.slice(-1)[0].timestamp.valueOf()
            : 0,
    );

    const suggestedItems =
        itemsQuery.data
            // sort in reverse chronological order of creation date
            // Could sort by more complex combinations of factors to suggest items
            // to generate flashcards for e.g. articles rather than social media posts
            ?.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
            .slice(0, 8) ?? [];

    const itemsWithFlashcards =
        itemsQuery.data?.filter((item) => item.flashcards.length > 0) ?? [];

    const [selectedItem, setSelectedItem] = useState<
        (Item & { collection: Collection; tags: Tag[] }) | null
    >(null);

    const [selectedFlashcard, setSelectedFlashcard] = useState<
        | (Flashcard & { item: Item & { collection: Collection; tags: Tag[] } })
        | null
    >(null);

    return (
        <div className="flex flex-col gap-5">
            <PageTitle>Flashcards</PageTitle>

            <Card className="p-6 mx-8 rounded-lg">
                <H3>Generate Flashards</H3>
                <div className="relative mt-3 mb-4">
                    <Input
                        className="text-base border-solid rounded-md"
                        placeholder="Article title..."
                        value={itemInput}
                        onChange={(e) => setItemInput(e.target.value)}
                    />

                    {itemInput &&
                        itemsQuery.data &&
                        itemsQuery.data.filter((item) => {
                            return item.title
                                .toLowerCase()
                                .includes(itemInput.toLowerCase());
                        }).length > 0 && (
                            <div className="absolute z-10 w-full px-1 py-1 bg-white border border-solid rounded-md top-12 border-input">
                                {itemsQuery.data
                                    ?.filter((item) => {
                                        return item.title
                                            .toLowerCase()
                                            .includes(itemInput.toLowerCase());
                                    })
                                    .map((item) => {
                                        return (
                                            <FlashcardSearchResult
                                                key={item.id}
                                                item={item}
                                            />
                                        );
                                    })}
                            </div>
                        )}
                </div>
                <H4>Suggested</H4>
                <ScrollArea type="scroll">
                    <div className="flex gap-3 p-1">
                        {suggestedItems.map((item) => (
                            <ItemCard
                                key={item.id}
                                className="w-[25rem] h-[30rem] max-h-[50vh] bg-transparent"
                                data={item}
                                selected={selectedItem?.id === item.id}
                                onSelect={() => setSelectedItem(item)}
                                hideOptions
                                format={{ growHeight: true }}
                            />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Card>
            <Card className="p-6 mx-8 rounded-lg">
                <H3>My Flashcards</H3>
                <div className="w-full h-24 flex flex-col justify-center items-center gap-3">
                    <div>
                        <span className="font-bold text-lg">{`${revisionQueue.length}`}</span>
                        &nbsp;{"flashcards due for review"}
                    </div>
                    <Button
                        onClick={() => router.push("/app/flashcards/review")}
                        size="lg"
                    >
                        Start Review
                    </Button>
                </div>
                <H4>Revision Queue</H4>
                <ScrollArea type="scroll">
                    <div className="flex gap-3 p-1">
                        {revisionQueue?.map((flashcard) => (
                            <FlashcardPreviewCard
                                key={flashcard.id}
                                data={flashcard}
                                onClick={() => setSelectedFlashcard(flashcard)}
                            />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <H4 className="mt-3">Recently Viewed</H4>
                <ScrollArea type="scroll">
                    <div className="flex gap-3 p-1">
                        {recentlyViewed?.map((flashcard) => (
                            <FlashcardPreviewCard
                                key={flashcard.id}
                                data={flashcard}
                                onClick={() => setSelectedFlashcard(flashcard)}
                            />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Card>
            <Card className="p-6 mx-8 rounded-lg">
                <H3>Items with Flashcards</H3>
                <H4>Recently Created</H4>
                <ScrollArea type="scroll">
                    <div className="flex gap-3 p-1">
                        {itemsWithFlashcards.map((item) => (
                            <ItemForFlashcards
                                key={item.id}
                                className="w-[25rem] h-[26.5rem] max-h-[50vh] bg-transparent"
                                data={item}
                                selected={false}
                                onSelect={(id: string) => {
                                    router.push(`/app/flashcards/${id}`);
                                }}
                            />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Card>
            {selectedItem && (
                <FlashcardsDialog
                    data={selectedItem}
                    open={selectedItem !== null}
                    onOpenChange={(value: boolean) => {
                        if (!value) {
                            setSelectedItem(null);
                        }
                    }}
                />
            )}
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
