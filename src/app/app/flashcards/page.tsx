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
    Link,
    ScrollArea,
    ScrollBar,
    SimpleItemCardFooter,
} from "@/ui/components";
import { FlashcardsDialog } from "@/ui/components/GenerationDialog";
import { Progress } from "@/ui/components/Progress";
import { H4 } from "@/ui/components/typography";
import { cn } from "@/ui/utils";
import { Collection, Flashcard, Item, Tag } from "@prisma/client";
import { useState } from "react";
import { H3, PageTitle } from "../../../../ui/components/typography";
import { ReviewRatingEnum } from "../../utils/ReviewRating";
import { trpc } from "../../utils/trpc";

interface DummyFlashcard {
    id: number;
    question: string;
    answer: string;
    experience: FlashcardExperience;
    range: FlashcardRange;
    due: string;
    reviews: DummyFlashcardReview[];
    item: Item & { collection: Collection; tags: Tag[] };
}

interface DummyFlashcardReview {
    id: number;
    timestamp: string;
    rating: ReviewRatingEnum;
}

const dummyFlashcardsData: DummyFlashcard[] = [
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
    const [itemInput, setItemInput] = useState("");
    const itemsQuery = trpc.item.getUserItems.useQuery();
    const flashcardsQuery = trpc.flashcards.getUserFlashcards.useQuery();

    const revisionQueue =
        flashcardsQuery.data?.sort(
            (a, b) => a.dueDate.valueOf() - b.dueDate.valueOf()
        ) ?? [];

    const recentlyViewed = flashcardsQuery.data?.sort((a, b) =>
        a.reviews.length > 0 && b.reviews.length > 0
            ? b.reviews.slice(-1)[0].timestamp.valueOf() -
              a.reviews.slice(-1)[0].timestamp.valueOf()
            : 0
    );

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
            {/* <Card className="p-6 mx-8 rounded-lg">
                <H3>Items with Flashcards</H3>
                <H4>Recently Created</H4>
            </Card> */}
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

function FlashcardPreviewCard({
    data,
    onClick,
}: {
    data: Flashcard & { item: Item & { collection: Collection; tags: Tag[] } };
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
    return (
        <Card
            key={data.id}
            className="w-[30rem] h-[26rem] max-h-[50vh] bg-transparent"
        >
            <div
                className={cn(
                    "group/flashcardpreview w-full relative border rounded-t-lg overflow-hidden aspect-[16/9] hover:",
                    "transition-[transform,border-color,border-radius]",
                    "hover:scale-[101%] hover:shadow-md hover:border-slate-500 hover:rounded-lg hover:cursor-pointer"
                )}
                onClick={onClick}
            >
                <img
                    src={
                        data.item.thumbnail ??
                        "https://www.maxpixel.net/static/photo/2x/Snow-Peaks-Ai-Generated-Artwork-Mountains-Forest-7903258.jpg"
                    }
                    alt="Image"
                    className="absolute w-full h-full object-cover object-center blur group-hover/flashcardpreview:blur-[6px] transition"
                />
                <div className="absolute w-full h-full text-slate-100/90 text-lg bg-black/50 flex flex-col justify-between items-center shadow-[0_-32px_83px_-25px_rgba(0,0,0,0.65)_inset] group-hover/flashcardpreview:bg-black/40 transition">
                    <div className="px-4 pt-4 pb-3 w-[75%] max-w-[24rem] h-full grow text-xl text-center font-medium tracking-wide flex items-center">
                        {data.question}
                    </div>
                    <div className="px-4 py-2">
                        <button className="py-2 rounded-full bg-slate-200/20 px-7 hover:bg-slate-100/30">
                            View
                        </button>
                    </div>
                    <div className="flex gap-2 px-4 py-3 text-sm text-slate-400/90">
                        <span>{FlashcardExperienceNames[data.experience]}</span>
                        <span>&#183;</span>
                        <span>{FlashcardRangeNames[data.range]}</span>
                    </div>
                </div>
            </div>
            <div>
                <CardHeader className="pt-2 overflow-y-hidden">
                    <div className="flex items-center justify-between py-1 text-sm">
                        {data.dueDate.valueOf() < Date.now().valueOf() ? (
                            <div className="flex items-center gap-1 font-semibold text-orange-600">
                                {"Due now"}
                            </div>
                        ) : (
                            "Due tomorrow"
                        )}
                        <div className="text-slate-500">
                            Last revisited 3 days ago
                        </div>
                    </div>
                    {data.item.title ? (
                        <CardTitle>{data.item.title}</CardTitle>
                    ) : null}
                </CardHeader>
                <SimpleItemCardFooter
                    url={data.item.url}
                    type={data.item.type}
                    title={data.item.title}
                    collection={data.item.collection}
                    tags={data.item.tags}
                    description={data.item.description}
                    thumbnail={data.item.thumbnail}
                    siteName={data.item.siteName}
                    favicon={data.item.favicon}
                />
            </div>
        </Card>
    );
}

function FlashcardDialog({
    flashcard,
    item,
    open,
    onOpenChange,
}: {
    flashcard: Flashcard & {
        item: Item & { collection: Collection; tags: Tag[] };
    };
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
                        "group/flashcarddialog w-full relative border rounded-lg overflow-hidden aspect-[16/9]"
                    )}
                >
                    <img
                        src={
                            flashcard.item.thumbnail ??
                            "https://www.maxpixel.net/static/photo/2x/Snow-Peaks-Ai-Generated-Artwork-Mountains-Forest-7903258.jpg"
                        }
                        alt="Image"
                        className="absolute object-cover object-center w-full h-full blur"
                    />
                    <div className="absolute w-full h-full text-slate-100/90 text-lg bg-black/50 shadow-[0_-32px_83px_-25px_rgba(0,0,0,0.65)_inset]">
                        <div className="flex flex-col items-center w-full h-full px-4 py-16 justify-evenly ">
                            <div
                                className={cn(
                                    "px-4 pt-4 pb-3 w-[80%] max-w-[52rem] h-full grow text-xl text-center font-medium tracking-wide flex items-center"
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
                                    }
                                )}
                            >
                                <button
                                    className={cn(
                                        "bg-slate-200/20 px-10 py-4 rounded-full hover:bg-slate-100/30",
                                        { "hidden ": showAnswer }
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
                                    }
                                )}
                            >
                                {flashcard.answer}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full ">
                    <div className="w-[70%] ">
                        <div className="flex flex-col justify-between w-full">
                            <div className="flex items-center justify-between py-1">
                                {flashcard.dueDate.valueOf() <
                                Date.now().valueOf() ? (
                                    <div className="flex items-center gap-1 font-semibold text-orange-600">
                                        {"Due now"}
                                    </div>
                                ) : (
                                    "Due tomorrow"
                                )}
                                <div className="text-slate-500">
                                    Last revisited 3 days ago
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="px-1 mr-2 text-xl">{"65%"}</div>
                                <Progress value={65} />
                            </div>
                            <div className="flex gap-2 py-1 text-sm text-slate-400/90">
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
                            <span className="font-mono text-3xl font-bold">
                                1
                            </span>
                            <span className="ml-2">easy</span>
                        </div>
                        <div className="text-medium">
                            <span className="font-mono text-3xl font-bold">
                                4
                            </span>
                            <span className="ml-2">medium</span>
                        </div>
                        <div className="text-hard">
                            <span className="font-mono text-3xl font-bold">
                                3
                            </span>
                            <span className="ml-2">hard</span>
                        </div>
                        <div className="text-forgot">
                            <span className="font-mono text-3xl font-bold">
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
//                     className="relative object-cover object-center w-full h-full"
//                 />
//             </div>
//         );
//     } else {
//         return null;
//     }
// }
