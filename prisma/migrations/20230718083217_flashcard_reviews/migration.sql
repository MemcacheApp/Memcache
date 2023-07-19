-- AlterTable
ALTER TABLE "FlashcardReview" ADD COLUMN     "flashcardId" TEXT;

-- AddForeignKey
ALTER TABLE "FlashcardReview" ADD CONSTRAINT "FlashcardReview_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
