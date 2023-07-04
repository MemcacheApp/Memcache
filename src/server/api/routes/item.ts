import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import ItemController from "../../controllers/item-controller";
import {
    CreateFromURLError,
    GetItemError,
} from "../../controllers/errors/item";
import { TRPCError } from "@trpc/server";
import { AuthError } from "../../controllers/errors/user";

export const itemRouter = router({
    getItem: protectedProcedure
        .input(z.object({ itemId: z.string() }))
        .query(async ({ input }) => {
            try {
                return ItemController.getItem(input.itemId);
            } catch (e) {
                if (e instanceof GetItemError) {
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
    getUserItems: protectedProcedure.query(async ({ ctx }) => {
        try {
            return await ItemController.getUserItems(ctx.userId);
        } catch (e) {
            console.error(e);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
            });
        }
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
            try {
                return await ItemController.createFromURL(
                    ctx.userId,
                    input.url,
                    input.collectionName,
                    input.tagNames
                );
            } catch (e) {
                if (e instanceof CreateFromURLError) {
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
    deleteItem: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ItemController.deleteItem(ctx.userId, input.id);
            } catch (e) {
                if (e instanceof AuthError) {
                    throw new TRPCError({
                        message: e.message,
                        code: "UNAUTHORIZED",
                    });
                } else if (e instanceof GetItemError) {
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
    setItemStatus: protectedProcedure
        .input(z.object({ itemId: z.string(), status: z.number() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ItemController.setItemStatus(
                    ctx.userId,
                    input.itemId,
                    input.status
                );
            } catch (e) {
                if (e instanceof AuthError) {
                    throw new TRPCError({
                        message: e.message,
                        code: "UNAUTHORIZED",
                    });
                } else if (e instanceof GetItemError) {
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
    setItemCollection: protectedProcedure
        .input(z.object({ itemId: z.string(), collectionName: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ItemController.setItemCollection(
                    ctx.userId,
                    input.itemId,
                    input.collectionName
                );
            } catch (e) {
                if (e instanceof AuthError) {
                    throw new TRPCError({
                        message: e.message,
                        code: "UNAUTHORIZED",
                    });
                } else if (e instanceof GetItemError) {
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
    addTag: protectedProcedure
        .input(z.object({ itemId: z.string(), tagName: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ItemController.addTag(
                    ctx.userId,
                    input.itemId,
                    input.tagName
                );
            } catch (e) {
                if (e instanceof AuthError) {
                    throw new TRPCError({
                        message: e.message,
                        code: "UNAUTHORIZED",
                    });
                } else if (e instanceof GetItemError) {
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
    removeTag: protectedProcedure
        .input(z.object({ itemId: z.string(), tagId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ItemController.removeTag(
                    ctx.userId,
                    input.itemId,
                    input.tagId
                );
            } catch (e) {
                if (e instanceof AuthError) {
                    throw new TRPCError({
                        message: e.message,
                        code: "UNAUTHORIZED",
                    });
                } else if (e instanceof GetItemError) {
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
