import { protectedProcedure, router } from "../trpc";
import SummaryController from "../../controllers/summary-controller";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const summaryRouter = router({
    generateSummary: protectedProcedure
        .input(
            z.object({
                itemId: z.string(),
                numOfWords: z.number(),
                experience: z.number(),
                finetuning: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const { itemId, numOfWords, experience, finetuning } = input;
                await SummaryController.generateSummary(
                    itemId,
                    numOfWords,
                    experience,
                    finetuning
                );
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        }),
});
