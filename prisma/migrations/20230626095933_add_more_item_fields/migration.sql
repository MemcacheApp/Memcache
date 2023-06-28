/*
  Warnings:

  - Added the required column `siteName` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "author" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "releaseTime" TIMESTAMP(3),
ADD COLUMN     "siteName" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
