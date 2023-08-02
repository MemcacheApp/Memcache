/*
  Warnings:

  - Changed the type of `experience` on the `Summary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `finetuning` on the `Summary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "experience",
ADD COLUMN     "experience" "SummaryExperience" NOT NULL,
DROP COLUMN "finetuning",
ADD COLUMN     "finetuning" "SummaryFinetuning" NOT NULL;
