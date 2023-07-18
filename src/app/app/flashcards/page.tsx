"use client";

import {
    FlashcardExperience,
    FlashcardExperienceNames,
    FlashcardRange,
    FlashcardRangeNames,
} from "@/src/datatypes/flashcard";
import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    ItemCard,
    ScrollArea,
    ScrollBar,
    SimpleItemCardFooter,
} from "@/ui/components";
import { FlashcardsDialog } from "@/ui/components/GenerationDialog";
import { Progress } from "@/ui/components/Progress";
import { H4 } from "@/ui/components/typography";
import { cn } from "@/ui/utils";
import { Collection, Item, Tag } from "@prisma/client";
import { useState } from "react";
import { H3, PageTitle } from "../../../../ui/components/typography";
import { ReviewRatingEnum } from "../../utils/ReviewRating";
import { trpc } from "../../utils/trpc";

interface Flashcard {
    id: number;
    question: string;
    answer: string;
    experience: FlashcardExperience;
    range: FlashcardRange;
    due: string;
    reviews: FlashcardReview[];
    item: Item & { collection: Collection; tags: Tag[] };
}

interface FlashcardReview {
    id: number;
    timestamp: string;
    rating: ReviewRatingEnum;
}

const flashcardsData: Flashcard[] = [
    {
        id: 1,
        question:
            "What is the purpose of the protocol parameter in the WebSocket constructor?",
        answer: "The protocol parameter is used to indicate sub-protocols, allowing a server to implement multiple WebSocket sub-protocols.",
        experience: FlashcardExperience.Intermediate,
        range: FlashcardRange.Depth,
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
        item: {
            id: "f8b70a1d-806d-4e33-a599-fa8418f714b1",
            type: "article",
            status: 0,
            collectionId: "c1fba9e8-5c90-4486-9f9a-e4e198ab59bc",
            title: "Writing WebSocket client applications - Web APIs | MDN",
            url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications",
            description:
                "WebSocket client applications use the WebSocket API to communicate with WebSocket servers using the WebSocket protocol.",
            thumbnail:
                "https://images.nightcafe.studio/jobs/UUCFR8ZnsnXKdbDPXntw/UUCFR8ZnsnXKdbDPXntw_7.4977x.jpg?tr=w-1600,c-at_max",
            createdAt: new Date("2023-07-17T05:22:07.265Z"),
            userId: "4fa44a7f-f76f-4687-9f18-4f3991aed370",
            siteName: "developer.mozilla.org",
            duration: null,
            releaseTime: null,
            author: null,
            favicon: null,
            tags: [],
            collection: {
                id: "c1fba9e8-5c90-4486-9f9a-e4e198ab59bc",
                name: "Default",
                userId: "4fa44a7f-f76f-4687-9f18-4f3991aed370",
            },
        },
    },
    {
        id: 2,
        question: "What parameter does the WebSocket constructor accept?",
        answer: "The WebSocket constructor accepts a URL and an optional protocol parameter.",
        experience: FlashcardExperience.Intermediate,
        range: FlashcardRange.Depth,
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
        item: {
            id: "f8b70a1d-806d-4e33-a599-fa8418f714b1",
            type: "article",
            status: 0,
            collectionId: "c1fba9e8-5c90-4486-9f9a-e4e198ab59bc",
            title: "Writing WebSocket client applications - Web APIs | MDN",
            url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications",
            description:
                "WebSocket client applications use the WebSocket API to communicate with WebSocket servers using the WebSocket protocol.",
            thumbnail:
                "https://images.nightcafe.studio/jobs/UUCFR8ZnsnXKdbDPXntw/UUCFR8ZnsnXKdbDPXntw_7.4977x.jpg?tr=w-1600,c-at_max",
            createdAt: new Date("2023-07-17T05:22:07.265Z"),
            userId: "4fa44a7f-f76f-4687-9f18-4f3991aed370",
            siteName: "developer.mozilla.org",
            duration: null,
            releaseTime: null,
            author: null,
            favicon: null,
            tags: [],
            collection: {
                id: "c1fba9e8-5c90-4486-9f9a-e4e198ab59bc",
                name: "Default",
                userId: "4fa44a7f-f76f-4687-9f18-4f3991aed370",
            },
        },
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

    const [selectedItem, setSelectedItem] = useState<
        (Item & { collection: Collection; tags: Tag[] }) | null
    >(null);

    const [selectedFlashcard, setSelectedFlashcard] =
        useState<Flashcard | null>(null);

    return (
        <div className="flex flex-col gap-5">
            <PageTitle>Flashcards</PageTitle>

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
            <Card className="rounded-lg mx-8 p-6">
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
            <Card className="rounded-lg mx-8 p-6">
                <H3>My Flashcards</H3>
                <H4>Revision Queue</H4>
                <ScrollArea type="scroll">
                    <div className="flex gap-3 p-1">
                        {flashcardsData?.map((flashcard) => (
                            <Card
                                key={flashcard.id}
                                className="w-[30rem] h-[26rem] max-h-[50vh] bg-transparent"
                            >
                                <div
                                    className={cn(
                                        "group/flashcardpreview w-full relative border rounded-t-lg overflow-hidden aspect-[16/9] hover:",
                                        "transition-[transform,border-color,border-radius]",
                                        "hover:scale-[101%] hover:shadow-md hover:border-slate-500 hover:rounded-lg hover:cursor-pointer",
                                    )}
                                    onClick={() =>
                                        setSelectedFlashcard(flashcard)
                                    }
                                >
                                    <img
                                        src={
                                            flashcard.item.thumbnail ??
                                            "https://www.maxpixel.net/static/photo/2x/Snow-Peaks-Ai-Generated-Artwork-Mountains-Forest-7903258.jpg"
                                        }
                                        alt="Image"
                                        className="absolute w-full h-full object-cover object-center blur group-hover/flashcardpreview:blur-[6px] transition"
                                    />
                                    <div className="absolute w-full h-full text-slate-100/90 text-lg bg-black/50 flex flex-col justify-between items-center shadow-[0_-32px_83px_-25px_rgba(0,0,0,0.65)_inset] group-hover/flashcardpreview:bg-black/40 transition">
                                        <div className="px-4 pt-4 pb-3 w-[75%] max-w-[24rem] h-full grow text-xl text-center font-medium tracking-wide flex items-center">
                                            {flashcard.question}
                                        </div>
                                        <div className="px-4 py-2">
                                            <button className="bg-slate-200/20 px-7 py-2 rounded-full hover:bg-slate-100/30">
                                                View
                                            </button>
                                        </div>
                                        <div className="px-4 py-3 flex gap-2 text-sm text-slate-400/90">
                                            <span>
                                                {
                                                    FlashcardExperienceNames[
                                                        flashcard.experience
                                                    ]
                                                }
                                            </span>
                                            <span>&#183;</span>
                                            <span>
                                                {
                                                    FlashcardRangeNames[
                                                        flashcard.range
                                                    ]
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <CardHeader className="overflow-y-hidden">
                                        {flashcard.item.title ? (
                                            <CardTitle>
                                                {flashcard.item.title}
                                            </CardTitle>
                                        ) : null}
                                    </CardHeader>
                                    <SimpleItemCardFooter
                                        url={flashcard.item.url}
                                        type={flashcard.item.type}
                                        title={flashcard.item.title}
                                        collection={flashcard.item.collection}
                                        tags={flashcard.item.tags}
                                        description={flashcard.item.description}
                                        thumbnail={flashcard.item.thumbnail}
                                        siteName={flashcard.item.siteName}
                                        favicon={flashcard.item.favicon}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <H4 className="mt-3">Recently Viewed</H4>
            </Card>
            <Card className="rounded-lg mx-8 p-6">
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
            {selectedFlashcard && (
                <FlashcardDialog
                    flashcard={selectedFlashcard}
                    item={selectedFlashcard.item}
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

function FlashcardDialog({
    flashcard,
    item,
    open,
    onOpenChange,
}: {
    flashcard: Flashcard;
    item: Item & { collection: Collection; tags: Tag[] };
    open: boolean;
    onOpenChange: (value: boolean) => void;
}) {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[85%] sm:max-w-[860px]">
                <DialogHeader>
                    <DialogTitle>Flashcard</DialogTitle>
                </DialogHeader>
                <div
                    className={cn(
                        "group/flashcarddialog w-full relative border rounded-lg overflow-hidden aspect-[16/9]",
                    )}
                >
                    <img
                        src={
                            flashcard.item.thumbnail ??
                            "https://www.maxpixel.net/static/photo/2x/Snow-Peaks-Ai-Generated-Artwork-Mountains-Forest-7903258.jpg"
                        }
                        alt="Image"
                        className="absolute w-full h-full object-cover object-center blur"
                    />
                    <div className="absolute w-full h-full text-slate-100/90 text-lg bg-black/50 shadow-[0_-32px_83px_-25px_rgba(0,0,0,0.65)_inset]">
                        <div className="w-full h-full px-4 py-16 flex flex-col justify-evenly items-center ">
                            <div
                                className={cn(
                                    "px-4 pt-4 pb-3 w-[80%] max-w-[52rem] h-full grow text-xl text-center font-medium tracking-wide flex items-center",
                                )}
                            >
                                {flashcard.question}
                            </div>

                            <div
                                className={cn(
                                    "px-4 py-2 h-full grow transition-[height,width,border-style,transform]",
                                    {
                                        "h-1 py-0 w-[45%] border-solid border-t-2":
                                            showAnswer,
                                    },
                                )}
                            >
                                <button
                                    className={cn(
                                        "bg-slate-200/20 px-10 py-4 rounded-full hover:bg-slate-100/30",
                                        { "hidden ": showAnswer },
                                    )}
                                    onClick={() => {
                                        setShowAnswer(true);
                                        console.log("clicked");
                                    }}
                                >
                                    Answer
                                </button>
                            </div>
                            <div
                                className={cn(
                                    "px-4 py-0 h-0 w-[90%] max-w-[56rem] opacity-0 text-center flex items-center transition-[height,opacity] overflow-y-hidden",
                                    {
                                        "h-full grow py-2 opacity-1":
                                            showAnswer,
                                    },
                                )}
                            >
                                {flashcard.answer}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex ">
                    <div className="w-[70%] ">
                        <div className="w-full flex flex-col justify-between">
                            <div className="py-1 flex justify-between items-center">
                                <div className="font-semibold">
                                    Due tomorrow
                                </div>
                                <div>Last revisited 3 days ago</div>
                            </div>
                            <div className="py-1 flex justify-between items-center">
                                <div className="text-xl px-1 mr-2">{"65%"}</div>
                                <Progress value={65} />
                            </div>
                            <div className="py-1 flex gap-2 text-sm text-slate-400/90">
                                <span>
                                    {
                                        FlashcardExperienceNames[
                                            flashcard.experience
                                        ]
                                    }
                                </span>
                                <span>&#183;</span>
                                <span>
                                    {FlashcardRangeNames[flashcard.range]}
                                </span>
                            </div>
                        </div>
                        <CardHeader className="px-0 overflow-y-hidden">
                            {item.title ? (
                                <CardTitle>{item.title}</CardTitle>
                            ) : null}
                        </CardHeader>
                        <SimpleItemCardFooter
                            url={item.url}
                            type={item.type}
                            title={item.title}
                            collection={item.collection}
                            tags={item.tags}
                            description={item.description}
                            thumbnail={item.thumbnail}
                            siteName={item.siteName}
                            favicon={item.favicon}
                            className="px-0"
                        />
                    </div>
                    <div className="ml-[2.5rem] flex flex-col gap-2">
                        <div className="text-easy">
                            <span className="text-3xl font-bold font-mono">
                                1
                            </span>
                            <span className="ml-2">easy</span>
                        </div>
                        <div className="text-medium">
                            <span className="text-3xl font-bold font-mono">
                                4
                            </span>
                            <span className="ml-2">medium</span>
                        </div>
                        <div className="text-hard">
                            <span className="text-3xl font-bold font-mono">
                                3
                            </span>
                            <span className="ml-2">hard</span>
                        </div>
                        <div className="text-forgot">
                            <span className="text-3xl font-bold font-mono">
                                2
                            </span>
                            <span className="ml-2">forgot</span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Return</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
//                     className="object-cover object-center relative w-full h-full"
//                 />
//             </div>
//         );
//     } else {
//         return null;
//     }
// }
