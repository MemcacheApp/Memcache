/*
  Warnings:

  - You are about to drop the column `timestamp` on the `FlashcardReview` table. All the data in the column will be lost.
  - Added the required column `end` to the `FlashcardReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `FlashcardReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FlashcardReview" DROP COLUMN "timestamp",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;
