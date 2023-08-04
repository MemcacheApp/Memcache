import { FlashcardExperience, FlashcardRange } from "@/src/datatypes/flashcard";
import { FlashcardReviewRating } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import FlashcardController from "../../controllers/flashcard-controller";
import { protectedProcedure, router } from "../trpc";

export const flashcardsRouter = router({
    generateFlashcards: protectedProcedure
        .input(
            z.object({
                itemId: z.string(),
                numOfFlashcards: z.number(),
                experience: z.nativeEnum(FlashcardExperience),
                range: z.nativeEnum(FlashcardRange),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const { itemId, numOfFlashcards, experience, range } = input;
                await FlashcardController.generateFlashcards(
                    ctx.userId,
                    itemId,
                    numOfFlashcards,
                    experience,
                    range,
                );
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        }),

    getUserFlashcards: protectedProcedure.query(async ({ ctx }) => {
        try {
            const flashcards = await FlashcardController.getUserFlashcards(
                ctx.userId,
            );
            return flashcards;
        } catch (e) {
            console.log(e);
        }
    }),

    getUserFlashcardsById: protectedProcedure
        .input(z.array(z.string()))
        .query(async ({ ctx, input }) => {
            try {
                const flashcards =
                    await FlashcardController.getUserFlashcardsById(
                        ctx.userId,
                        input,
                    );
                return flashcards;
            } catch (e) {
                console.log(e);
            }
        }),

    getUserRecentlyCreated: protectedProcedure.query(async ({ ctx }) => {
        try {
            const flashcards = await FlashcardController.getUserRecentlyCreated(
                ctx.userId,
            );
            return flashcards;
        } catch (e) {
            console.log(e);
        }
    }),

    getUserRecentlyReviewed: protectedProcedure.query(async ({ ctx }) => {
        try {
            const flashcards =
                await FlashcardController.getUserRecentlyReviewed(ctx.userId);
            return flashcards;
        } catch (e) {
            console.log(e);
        }
    }),

    getUserRevisionQueue: protectedProcedure.query(async ({ ctx }) => {
        try {
            const flashcards = await FlashcardController.getUserRevisionQueue(
                ctx.userId,
            );
            return flashcards;
        } catch (e) {
            console.log(e);
        }
    }),

    getSuggestedItems: protectedProcedure.query(async ({ ctx }) => {
        try {
            return await FlashcardController.getSuggestedItems(ctx.userId);
        } catch (e) {
            console.error(e);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
            });
        }
    }),

    addReview: protectedProcedure
        .input(
            z.object({
                flashcardId: z.string(),
                reviewStart: z.date(),
                reviewEnd: z.date(),
                reviewRating: z.nativeEnum(FlashcardReviewRating),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                await FlashcardController.addReview(
                    ctx.userId,
                    input.flashcardId,
                    input.reviewStart,
                    input.reviewEnd,
                    input.reviewRating,
                );
            } catch (e) {
                console.log(e);
            }
        }),
});
