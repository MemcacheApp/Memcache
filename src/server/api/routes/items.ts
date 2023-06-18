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
    createItem: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                url: z.string(),
                description: z.string(),
                collectionName: z.string(),
                tagNames: z.string().array(),
                thumbnail: z.string().nullable(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const item = await ItemController.createItem(
                input.title,
                input.url,
                input.description,
                input.collectionName,
                input.tagNames,
                input.thumbnail,
                ctx.userId
            );
            return item;
        }),
    deleteItem: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            ItemController.deleteItem(input.id, ctx.userId);
        }),
});
