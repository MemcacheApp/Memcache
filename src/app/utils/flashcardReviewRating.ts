import { FlashcardReviewRating } from "@prisma/client";

/**
 * Given a FlashcardReviewRating, return the corresponding color.
 * Colors are expected to be defined in tailwind.config.js inside
 * theme.extend.colors
 */
export const reviewRatingToColor = (
    rating: FlashcardReviewRating,
): "easy" | "medium" | "hard" | "forgot" => {
    switch (rating) {
        case FlashcardReviewRating.Easy:
            return "easy";
        case FlashcardReviewRating.Medium:
            return "medium";
        case FlashcardReviewRating.Hard:
            return "hard";
        case FlashcardReviewRating.Forgot:
            return "forgot";
    }
};
