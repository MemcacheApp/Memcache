/*
  Warnings:

  - The values [EASY,MEDIUM,HARD,FORGOT] on the enum `FlashcardReviewRating` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FlashcardReviewRating_new" AS ENUM ('Easy', 'Medium', 'Hard', 'Forgot');
ALTER TABLE "FlashcardReview" ALTER COLUMN "rating" TYPE "FlashcardReviewRating_new" USING ("rating"::text::"FlashcardReviewRating_new");
ALTER TYPE "FlashcardReviewRating" RENAME TO "FlashcardReviewRating_old";
ALTER TYPE "FlashcardReviewRating_new" RENAME TO "FlashcardReviewRating";
DROP TYPE "FlashcardReviewRating_old";
COMMIT;
