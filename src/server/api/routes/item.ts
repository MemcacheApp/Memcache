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
	updateItemStatus: protectedProcedure
		.input(z.object({ itemId: z.string(), status: z.number() }))
		.mutation(async ({ ctx, input }) => {
			return ItemController.updateItemStatus(ctx.userId, input.itemId, input.status);
		}),
    setCollection: protectedProcedure
        .input(z.object({ itemId: z.string(), collectionName: z.string() }))
        .mutation(async ({ ctx, input }) => {
            ItemController.setCollection(
                ctx.userId,
                input.itemId,
                input.collectionName
            );
        }),
    addTag: protectedProcedure
        .input(z.object({ itemId: z.string(), tagName: z.string() }))
        .mutation(async ({ ctx, input }) => {
            ItemController.addTag(ctx.userId, input.itemId, input.tagName);
        }),
    removeTag: protectedProcedure
        .input(z.object({ itemId: z.string(), tagId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            ItemController.removeTag(ctx.userId, input.itemId, input.tagId);
        }),
});
