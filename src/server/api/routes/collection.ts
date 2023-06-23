import CollectionController from "../../controllers/collection-controller";
import { protectedProcedure, router } from "../trpc";

export const collectionRouter = router({
    getCollections: protectedProcedure.query(async ({ ctx }) => {
        const collections = await CollectionController.getCollectionNames(
            ctx.userId
        );
        return collections;
    }),
});
