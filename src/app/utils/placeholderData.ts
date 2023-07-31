import {
    Collection,
    FlashcardExperience,
    FlashcardRange,
    FlashcardReviewRating,
    Item,
    Tag,
} from "@prisma/client";

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
    rating: FlashcardReviewRating;
}

export const dummyFlashcardsData: DummyFlashcard[] = [
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
                rating: FlashcardReviewRating.Forgot,
            },
            {
                id: 2,
                timestamp: "2023-07-14T18:20:36.970+10:00",
                rating: FlashcardReviewRating.Hard,
            },
            {
                id: 3,
                timestamp: "2023-07-15T18:20:36.970+10:00",
                rating: FlashcardReviewRating.Medium,
            },
            {
                id: 4,
                timestamp: "2023-07-17T16:20:36.970+10:00",
                rating: FlashcardReviewRating.Easy,
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
                rating: FlashcardReviewRating.Medium,
            },
            {
                id: 2,
                timestamp: "2023-07-10T13:20:28.520+10:00",
                rating: FlashcardReviewRating.Easy,
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
