import { z } from "zod";
import CollectionController from "../../controllers/collection-controller";
import { protectedProcedure, router } from "../trpc";

export const collectionRouter = router({
    getUserCollections: protectedProcedure.query(async ({ ctx }) => {
        const collections = await CollectionController.getUserCollections(
            ctx.userId
        );
        return collections;
    }),

    getCollection: protectedProcedure
        .input(z.object({ collectionId: z.string() }))
        .query(async ({ ctx, input }) => {
            const collection = await CollectionController.getCollection(
                input.collectionId
            );
            return collection;
        }),
});
