"use client";

import { trpc } from "@/src/app/utils/trpc";
import {
    FlashcardExperienceNames,
    FlashcardRangeNames,
} from "@/src/datatypes/flashcard";
import { ReviewRatingButton } from "@/ui/components/Button";
import DueStatus from "@/ui/components/DueStatus";
import { SimpleItemCardFooter } from "@/ui/components/SimpleItemCard";
import { cn } from "@/ui/utils";
import {
    Collection,
    Flashcard,
    FlashcardReview,
    FlashcardReviewRating,
    Item,
    Tag,
} from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { CardHeader, CardTitle } from "./Card";
import LastReview from "./LastReview";

interface FlashcardReviewCardProps {
    flashcard: Flashcard & {
        item: Item & {
            collection: Collection;
            tags: Tag[];
        };
        reviews: FlashcardReview[];
    };
    onSubmit?: (rating: FlashcardReviewRating) => void;
    onNext?: () => void;
    viewOnly?: boolean;
}

export default function FlashcardReviewCard({
    flashcard,
    onSubmit,
    onNext,
    viewOnly = false,
}: FlashcardReviewCardProps) {
    const [showAnswer, setShowAnswer] = useState(false);
    const [startTime, setStartTime] = useState(new Date());

    useEffect(() => {
        setShowAnswer(false);
        setStartTime(new Date());
    }, [flashcard.id]);

    const addReviewMutation = trpc.flashcards.addReview.useMutation({
        onSuccess: () => {
            console.log(`Added review for flashcard ${flashcard.id}}`);
        },
    });

    const handleRateReview = (rating: FlashcardReviewRating) => {
        addReviewMutation.mutate({
            flashcardId: flashcard.id,
            reviewStart: startTime,
            reviewEnd: new Date(),
            reviewRating: rating,
        });
        setShowAnswer(false);
        onSubmit?.(rating);
        onNext?.();
    };

    const reviewRatingsCount = useMemo(
        () =>
            flashcard.reviews.reduce(
                (acc, review) => {
                    acc[review.rating] += 1;
                    return acc;
                },
                {
                    [FlashcardReviewRating.Easy]: 0,
                    [FlashcardReviewRating.Medium]: 0,
                    [FlashcardReviewRating.Hard]: 0,
                    [FlashcardReviewRating.Forgot]: 0,
                } as Record<FlashcardReviewRating, number>,
            ),
        [flashcard.reviews],
    );

    return (
        <div className="flex flex-col gap-2 w-full">
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
                    className="absolute object-cover object-center w-full h-full blur-[15px]"
                />
                <div className="absolute w-full h-full text-slate-100/90 text-lg bg-black/[0.65] shadow-[0_-32px_83px_-25px_rgba(0,0,0,0.75)_inset]">
                    <div className="flex flex-col items-center w-full h-full px-4 py-16 justify-evenly ">
                        <div
                            className={cn(
                                "px-4 pt-4 pb-3 w-[95%] @md/fcPreviewContainer:w-[75%] max-w-[52rem] text-xl text-center font-medium tracking-wide flex justify-center items-center",
                            )}
                        >
                            <p className="text-center">{flashcard.question}</p>
                        </div>

                        <div
                            className={cn(
                                "px-4 py-2 h-fit transition-[height,width,border-style,transform]",
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
                                }}
                            >
                                Answer
                            </button>
                        </div>
                        <div
                            className={cn(
                                "px-4 py-0 h-0 w-[90%] max-w-[56rem] opacity-0 flex justify-center items-center transition-[height,opacity] overflow-y-hidden",
                                {
                                    "h-fit py-2 opacity-1": showAnswer,
                                },
                            )}
                        >
                            <p className="text-center">{flashcard.answer}</p>
                        </div>
                        <div
                            className={cn(
                                "px-4 py-0 h-0 min-w-[510px] w-[80%] max-w-[860px] opacity-0 flex justify-between items-center transition-[height,opacity]",
                                {
                                    "h-fit py-2 opacity-1":
                                        showAnswer && !viewOnly,
                                },
                            )}
                        >
                            {(
                                Object.keys(FlashcardReviewRating) as Array<
                                    keyof typeof FlashcardReviewRating
                                >
                            ).map((rating) => (
                                <ReviewRatingButton
                                    key={rating}
                                    rating={rating}
                                    size="pillmd"
                                    onClick={() => handleRateReview(rating)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full ">
                <div className="w-[70%] ">
                    <div className="flex flex-col justify-between w-full">
                        <div className="flex items-center justify-between py-1 relative">
                            <DueStatus dueDate={flashcard.dueDate} />
                            <LastReview
                                reviewTime={flashcard.reviews.at(-1)?.end}
                            />
                        </div>
                        {/* <div className="flex items-center justify-between py-1">
                            <div className="px-1 mr-2 text-xl">{"65%"}</div>
                            <Progress value={65} />
                        </div> */}
                        <div className="flex gap-2 py-1 text-sm text-slate-400/90">
                            <span>
                                {FlashcardExperienceNames[flashcard.experience]}
                            </span>
                            <span>&#183;</span>
                            <span>{FlashcardRangeNames[flashcard.range]}</span>
                        </div>
                    </div>
                    <CardHeader className="px-0 overflow-y-hidden">
                        {flashcard.item.title ? (
                            <CardTitle>{flashcard.item.title}</CardTitle>
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
                        className="px-0"
                    />
                </div>
                <div className="ml-[2.5rem] flex flex-col gap-2">
                    <div className="text-easy">
                        <span className="font-mono text-3xl font-bold">
                            {reviewRatingsCount[FlashcardReviewRating.Easy]}
                        </span>
                        <span className="ml-2">easy</span>
                    </div>
                    <div className="text-medium">
                        <span className="font-mono text-3xl font-bold">
                            {reviewRatingsCount[FlashcardReviewRating.Medium]}
                        </span>
                        <span className="ml-2">medium</span>
                    </div>
                    <div className="text-hard">
                        <span className="font-mono text-3xl font-bold">
                            {reviewRatingsCount[FlashcardReviewRating.Hard]}
                        </span>
                        <span className="ml-2">hard</span>
                    </div>
                    <div className="text-forgot">
                        <span className="font-mono text-3xl font-bold">
                            {reviewRatingsCount[FlashcardReviewRating.Forgot]}
                        </span>
                        <span className="ml-2">forgot</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
