-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "experience" "FlashcardExperience" NOT NULL DEFAULT 'Beginner',
ADD COLUMN     "range" "FlashcardRange" NOT NULL DEFAULT 'Balanced';
