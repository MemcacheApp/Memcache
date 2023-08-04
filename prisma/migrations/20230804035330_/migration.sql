/*
  Warnings:

  - Added the required column `eFactor` to the `Flashcard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "eFactor" DOUBLE PRECISION NOT NULL;
