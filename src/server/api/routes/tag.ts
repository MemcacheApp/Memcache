import { TRPCError } from "@trpc/server";
import TagController from "../../controllers/tag-controller";
import { protectedProcedure, router } from "../trpc";

export const tagRouter = router({
    getUserTags: protectedProcedure.query(async ({ ctx }) => {
        try {
            return await TagController.getUserTags(ctx.userId);
        } catch (e) {
            console.error(e);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
            });
        }
    }),
});
