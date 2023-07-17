"use client";

import { Button, Card, Input } from "@/ui/components";
import ExternalLink from "@/ui/components/ExternalLink";
import { H4 } from "@/ui/components/typography";
import { Collection, Item, Tag } from "@prisma/client";
import { Globe, Package2 } from "lucide-react";
import Link from "next/link";
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
        id: 1,
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

export default function FlashcardsPage() {
    const [url, setUrl] = useState("");

    const itemsQuery = trpc.item.getUserItems.useQuery();

    const suggestedItems =
        itemsQuery.data
            // sort in reverse chronological order of creation date
            // Could sort by more complex combinations of factors to suggest items
            // to generate flashcards for e.g. articles rather than social media posts
            ?.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
            .slice(0, 8) ?? [];

    return (
        <div className="flex flex-col mx">
            <PageTitle>Flashcards</PageTitle>
            <p>{`Prompt: "Recently I've picked up a new hobby: I'm learning to fly light aircraft and I find it very fun and interesting. However I have a lot to learn."`}</p>
            <p>{`(please don't click this too much lol it cost money)`}</p>
            {flashcardsData?.map((flashcard) => (
                <div
                    className="px-4 my-4 flex flex-col gap-3"
                    key={flashcard.id}
                >
                    <div className="flex">
                        <div className="mr-2 italic">Question:</div>
                        <div>{flashcard.question}</div>
                    </div>
                    <div className="flex align-center mt-2 ">
                        <div className="mr-2 italic">Answer:</div>
                        <div className="text-semibold">{flashcard.answer}</div>
                    </div>
                </div>
            ))}
            <Card className="rounded-lg px-6 py-6">
                <H3>Generate Flashards</H3>
                <div className="mt-3 mb-4">
                    <Input
                        className="text-base border-solid rounded-md"
                        placeholder="https://"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                <H4>Suggested</H4>
                <div className="mt-3 mb-4 w-full pb-4 flex flex-row flex-nowrap gap-4 overflow-x-scroll">
                    {suggestedItems.map((item) => (
                        <SuggestedItemCard key={item.id} item={item} />
                    ))}
                </div>
            </Card>
            <Card className="rounded-lg px-6 py-6">
                <H3>My Flashcards</H3>
                <H4>Revision Queue</H4>
                <H4>Recently Viewed</H4>
            </Card>
            <Card className="rounded-lg px-6 py-6">
                <H3>Items with Flashcards</H3>
                <H4>Recently Created</H4>
            </Card>
        </div>
    );
}

function SuggestedItemCard({
    item,
}: {
    item: Item & { collection: Collection; tags: Tag[] };
}) {
    return (
        <Card className="w-[380px] h-[460px] shrink-0 rounded-lg px-6 py-6">
            {item.title}
            {item.description}
            {item.siteName}
            <div className="flex flex-wrap gap-5 text-slate-450 text-sm">
                {item.siteName ? (
                    <ExternalLink
                        href={item.url ? item.url : "#"}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div className="h-full flex items-center gap-2">
                            {item.favicon ? (
                                <img
                                    width={16}
                                    height={16}
                                    src={item.favicon}
                                />
                            ) : (
                                <Globe size={16} />
                            )}

                            {item.siteName}
                        </div>
                    </ExternalLink>
                ) : null}
                {item.collection ? (
                    <Link href={`/app/collection/${item.collection.id}`}>
                        <div className="h-full flex items-center gap-2">
                            <Package2 size={16} />
                            {item.collection.name}
                        </div>
                    </Link>
                ) : null}
                {item.tags ? (
                    <div className="flex flex-wrap gap-3">
                        {item.tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={`/app/tag/${tag.id}`}
                                tabIndex={-1}
                            >
                                <Button
                                    className="px-4"
                                    variant="secondary"
                                    size="xs"
                                >
                                    {tag.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                ) : null}
            </div>
        </Card>
    );
}
