import { TRPCError } from "@trpc/server";
import DiscoveryController from "../../controllers/discovery-controller";
import { protectedProcedure, router } from "../trpc";

export const discoveryRouter = router({
    getSuggestedDiscoveryItems: protectedProcedure.query(async ({ ctx }) => {
        try {
            return DiscoveryController.getSuggestedDiscoveryItems(ctx.userId);
        } catch (e) {
            console.error(e);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
            });
        }
    }),
});
