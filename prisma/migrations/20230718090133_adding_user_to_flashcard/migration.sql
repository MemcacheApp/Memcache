/*
  Warnings:

  - Added the required column `userId` to the `Flashcard` table without a default value. This is not possible if the table is not empty.
  - Made the column `flashcardId` on table `FlashcardReview` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FlashcardReview" DROP CONSTRAINT "FlashcardReview_flashcardId_fkey";

-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FlashcardReview" ALTER COLUMN "flashcardId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashcardReview" ADD CONSTRAINT "FlashcardReview_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
