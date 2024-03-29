import { ItemStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { FetchURLError, GetItemError } from "../../controllers/errors/item";
import { AuthError } from "../../controllers/errors/user";
import ItemController from "../../controllers/item-controller";
import { protectedProcedure, router } from "../trpc";

export const itemRouter = router({
    getItem: protectedProcedure
        .input(z.object({ itemId: z.string() }))
        .query(async ({ input }) => {
            try {
                return ItemController.getItem(input.itemId);
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        }),
    getItems: protectedProcedure
        .input(z.object({ itemIds: z.string().array() }))
        .query(async ({ input }) => {
            try {
                return ItemController.getItems(input.itemIds);
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        }),
    getUserItems: protectedProcedure
        .input(
            z
                .object({
                    includedTags: z.string().array().optional(),
                    excludedTags: z.string().array().optional(),
                })
                .optional(),
        )
        .query(async ({ ctx, input }) => {
            try {
                return await ItemController.getUserItems(
                    ctx.userId,
                    input?.includedTags,
                    input?.excludedTags,
                );
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        }),
    getItemFlashcards: protectedProcedure
        .input(
            z.object({
                itemId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                return await ItemController.getItemFlashcards(
                    ctx.userId,
                    input.itemId,
                );
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        }),
    getUserItemsIncludeFlashcards: protectedProcedure.query(async ({ ctx }) => {
        try {
            return await ItemController.getUserItemsIncludeFlashcards(
                ctx.userId,
            );
        } catch (e) {
            console.error(e);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
            });
        }
    }),
    createItem: protectedProcedure
        .input(
            z.object({
                url: z.string(),
                collectionName: z.string(),
                tagNames: z.string().array(),
                public: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                return await ItemController.createItem(
                    ctx.userId,
                    input.url,
                    input.collectionName,
                    input.tagNames,
                    input.public,
                );
            } catch (e) {
                if (e instanceof FetchURLError) {
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
    fetchMetadata: protectedProcedure
        .input(
            z.object({
                url: z.string(),
            }),
        )
        .query(async ({ input }) => {
            try {
                return await ItemController.fetchMetadata(input.url);
            } catch (e) {
                if (e instanceof FetchURLError) {
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
        .input(
            z.object({
                itemId: z.string().or(z.string().array()),
                status: z.nativeEnum(ItemStatus),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                await ItemController.updateItemStatus(
                    ctx.userId,
                    input.itemId,
                    input.status,
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
        .input(
            z.object({
                itemId: z.string().or(z.string().array()),
                collectionName: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                await ItemController.setItemCollection(
                    ctx.userId,
                    input.itemId,
                    input.collectionName,
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
                    input.tagName,
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
                    input.tagId,
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
    setItemVisibility: protectedProcedure
        .input(
            z.object({
                itemId: z.string().or(z.string().array()),
                isPublic: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                await ItemController.setItemVibility(
                    ctx.userId,
                    input.itemId,
                    input.isPublic,
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
    getPublicItems: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                return await ItemController.getPublicItems(
                    ctx.userId,
                    input.userId,
                );
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
});
