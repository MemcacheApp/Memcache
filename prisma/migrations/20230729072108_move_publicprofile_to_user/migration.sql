/*
  Warnings:

  - You are about to drop the column `publicProfile` on the `UserPreferences` table. All the data in the column will be lost.
  - Added the required column `publicProfile` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "publicProfile" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "publicProfile";
