import { FlashcardExperience, FlashcardRange } from "@prisma/client";

export { FlashcardExperience, FlashcardRange } from "@prisma/client";
// export enum FlashcardExperience {
//     Beginner,
//     Intermediate,
//     Advanced,
// }

export const FlashcardExperienceNames: Record<FlashcardExperience, string> = {
    [FlashcardExperience.Beginner]: "Beginner",
    [FlashcardExperience.Intermediate]: "Intermediate",
    [FlashcardExperience.Advanced]: "Advanced",
};

// export enum FlashcardRange {
//     Depth,
//     Breadth,
//     Balanced,
// }

export const FlashcardRangeNames: Record<FlashcardRange, string> = {
    [FlashcardRange.Depth]: "Depth",
    [FlashcardRange.Breadth]: "Breadth",
    [FlashcardRange.Balanced]: "Balanced",
};
