"use client";

import {
    Card,
    Input,
    ItemCard,
    Link,
    ScrollArea,
    ScrollBar,
} from "@/ui/components";
import { FlashcardsDialog } from "@/ui/components/GenerationDialog";
import { H4 } from "@/ui/components/typography";
import { Collection, Item, Tag } from "@prisma/client";
import { useState } from "react";
import { H3, PageTitle } from "../../../../ui/components/typography";
import { ReviewRatingEnum } from "../../utils/ReviewRating";
import { trpc } from "../../utils/trpc";

const flashcardsData = [
    {
        id: 1,
        question:
            "What is the purpose of the protocol parameter in the WebSocket constructor?",
        answer: "The protocol parameter is used to indicate sub-protocols, allowing a server to implement multiple WebSocket sub-protocols.",
        due: "2023-07-23T18:20:36.970+10:00",
        reviews: [
            {
                id: 1,
                timestamp: "2023-07-13T18:20:36.970+10:00",
                rating: ReviewRatingEnum.Forgot,
            },
            {
                id: 2,
                timestamp: "2023-07-14T18:20:36.970+10:00",
                rating: ReviewRatingEnum.Hard,
            },
            {
                id: 3,
                timestamp: "2023-07-15T18:20:36.970+10:00",
                rating: ReviewRatingEnum.Medium,
            },
            {
                id: 4,
                timestamp: "2023-07-17T16:20:36.970+10:00",
                rating: ReviewRatingEnum.Easy,
            },
        ],
    },
    {
        id: 2,
        question: "What parameter does the WebSocket constructor accept?",
        answer: "The WebSocket constructor accepts a URL and an optional protocol parameter.",
        due: "2023-07-27T20:45:18.758+10:00",
        reviews: [
            {
                id: 1,
                timestamp: "2023-07-05T14:38:36.970+10:00",
                rating: ReviewRatingEnum.Medium,
            },
            {
                id: 2,
                timestamp: "2023-07-10T13:20:28.520+10:00",
                rating: ReviewRatingEnum.Easy,
            },
        ],
    },
];

function FlashcardSearchResult({ item }: { item: Item }) {
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
    const [itemInput, setItemInput] = useState("");
    const itemsQuery = trpc.item.getUserItems.useQuery();
    const flashcardsQuery = trpc.flashcards.getUserFlashcards.useQuery();

    const suggestedItems =
        itemsQuery.data
            // sort in reverse chronological order of creation date
            // Could sort by more complex combinations of factors to suggest items
            // to generate flashcards for e.g. articles rather than social media posts
            ?.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
            .slice(0, 8) ?? [];

    const [selectedItem, setSelectedItem] = useState<
        (Item & { collection: Collection; tags: Tag[] }) | null
    >(null);

    return (
        <div className="flex flex-col gap-5">
            <PageTitle>Flashcards</PageTitle>

            {flashcardsQuery.data?.map((flashcard) => (
                <div
                    className="flex flex-col gap-3 px-4 my-4"
                    key={flashcard.id}
                >
                    <div className="flex">
                        <div className="mr-2 italic">Question:</div>
                        <div>{flashcard.question}</div>
                    </div>
                    <div className="flex mt-2 align-center ">
                        <div className="mr-2 italic">Answer:</div>
                        <div className="text-semibold">{flashcard.answer}</div>
                    </div>
                </div>
            ))}
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
                <H4>Revision Queue</H4>
                <H4>Recently Viewed</H4>
            </Card>
            <Card className="p-6 mx-8 rounded-lg">
                <H3>Items with Flashcards</H3>
                <H4>Recently Created</H4>
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
        </div>
    );
}
