import { z } from "zod";
import CollectionController from "../../controllers/collection-controller";
import { protectedProcedure, router } from "../trpc";
import { GetCollectionError } from "../../controllers/errors/collection";
import { TRPCError } from "@trpc/server";

export const collectionRouter = router({
    getUserCollections: protectedProcedure.query(async ({ ctx }) => {
        try {
            return await CollectionController.getUserCollections(ctx.userId);
        } catch (e) {
            console.error(e);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
            });
        }
    }),

    getCollection: protectedProcedure
        .input(z.object({ collectionId: z.string() }))
        .query(async ({ input }) => {
            try {
                return await CollectionController.getCollection(
                    input.collectionId,
                );
            } catch (e) {
                if (e instanceof GetCollectionError) {
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
});
