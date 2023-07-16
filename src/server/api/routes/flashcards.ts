import { TRPCError } from "@trpc/server";
import { z } from "zod";
import FlashcardController from "../../controllers/flashcard-controller";
import { protectedProcedure, router } from "../trpc";

export const flashcardsRouter = router({
    /**
     * Returns:
     *  {
     *     flashcards: [
     *        {
     *          id: string,
     *          content: string,
     *        },
     *     ...  ]
     *  }
     */

    generateFlashcards: protectedProcedure
        .input(
            z.object({
                itemId: z.string(),
                numOfFlashcards: z.number(),
                experience: z.number(),
                range: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const { itemId, numOfFlashcards, experience, range } = input;
                await FlashcardController.generateFlashcards(
                    ctx.userId,
                    itemId,
                    numOfFlashcards,
                    experience,
                    range
                );
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        }),
});
