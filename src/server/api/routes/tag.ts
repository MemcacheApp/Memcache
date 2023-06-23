import TagController from "../../controllers/tag-controller";
import { protectedProcedure, router } from "../trpc";

export const tagRouter = router({
    getTags: protectedProcedure.query(async ({ ctx }) => {
        const tags = await TagController.getTagNames(ctx.userId);
        return tags;
    }),
});
