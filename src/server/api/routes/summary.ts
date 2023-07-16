import { protectedProcedure, router } from "../trpc";
import SummaryController from "../../controllers/summary-controller";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { GetSummaryError } from "../../controllers/errors/summary";

export const summaryRouter = router({
    getSummary: protectedProcedure
        .input(z.object({ itemId: z.string() }))
        .query(async ({ input }) => {
            try {
                return SummaryController.getSummary(input.itemId);
            } catch (e) {
                if (e instanceof GetSummaryError) {
                    throw new TRPCError({
                        message: e.message,
                        code: "BAD_REQUEST",
                    });
                } else {
                    console.error(e);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                    });
                }
            }
        }),
    getItemSummaries: protectedProcedure
        .input(z.object({ itemId: z.string() }))
        .query(async ({ input }) => {
            try {
                return SummaryController.getItemSummaries(input.itemId);
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        }),
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
