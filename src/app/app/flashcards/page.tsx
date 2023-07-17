"use client";

import { H3, PageTitle } from "../../../../ui/components/typography";
import { ReviewRatingEnum } from "../../utils/ReviewRating";

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
    return (
        <div className="flex flex-col">
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
            <div>
                <H3>Review</H3>
            </div>
        </div>
    );
}
