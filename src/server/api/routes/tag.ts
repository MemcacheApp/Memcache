import TagController from "../../controllers/tag-controller";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const tagRouter = router({
    getTags: protectedProcedure.query(async ({ ctx }) => {
        const tags = await TagController.getTagNames(ctx.userId);
        return tags;
    }),

    createTag: protectedProcedure
        .input(z.string().transform((name) => name.trim()))
        .mutation(async ({ ctx, input }) => {
            let tag = await TagController.getTagByName(ctx.userId, input);
            if (tag) {
                tag = await TagController.createTag(ctx.userId, input);
            }
            return tag;
        }),
});
