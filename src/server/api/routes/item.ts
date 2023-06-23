import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import ItemController from "../../controllers/item-controller";

export const itemRouter = router({
    getItem: protectedProcedure
        .input(z.object({ itemId: z.string() }))
        .query(async ({ input }) => {
            const item = await ItemController.getItem(input.itemId);
            return item;
        }),
    getItems: protectedProcedure.query(async ({ ctx }) => {
        const items = await ItemController.getItems(ctx.userId);
        return items;
    }),
    createFromURL: protectedProcedure
        .input(
            z.object({
                url: z.string(),
                collectionName: z.string(),
                tagNames: z.string().array(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const item = await ItemController.createFromURL(
                ctx.userId,
                input.url,
                input.collectionName,
                input.tagNames
            );
            return item;
        }),
    deleteItem: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            ItemController.deleteItem(ctx.userId, input.id);
        }),
});
