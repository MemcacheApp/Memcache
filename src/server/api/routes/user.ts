import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import UserController from "../../controllers/user-controller";
import {
    CreateUserError,
    GetUserError,
    LoginError,
    SendEmailError,
    VerifyCodeError,
} from "../../controllers/errors/user";

export const userRouter = router({
    createUser: publicProcedure
        .input(
            z.object({
                firstName: z.string(),
                lastName: z.string(),
                email: z.string(),
                password: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const { token } = await UserController.createUser(
                    input.firstName,
                    input.lastName,
                    input.email,
                    input.password
                );

                ctx.resHeaders.set(
                    "set-cookie",
                    `jwt=${token};HttpOnly;Secure;`
                );
            } catch (e) {
                if (e instanceof CreateUserError) {
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
    login: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const { token } = await UserController.login(
                    input.email,
                    input.password
                );
                ctx.resHeaders.set(
                    "set-cookie",
                    `jwt=${token};HttpOnly;Secure;`
                );
            } catch (e) {
                if (e instanceof LoginError) {
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
    isLoggedIn: publicProcedure.query(async ({ ctx }) => {
        try {
            await UserController.validate(ctx.req.headers.get("cookie"));
            return true;
        } catch (err) {
            return false;
        }
    }),
    sendResetEmail: publicProcedure
        .input(
            z.object({
                email: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                return await UserController.sendResetEmail(input.email);
            } catch (e) {
                if (e instanceof GetUserError) {
                    throw new TRPCError({
                        message: e.message,
                        code: "BAD_REQUEST",
                    });
                } else if (e instanceof SendEmailError) {
                    throw new TRPCError({
                        message: e.message,
                        code: "TOO_MANY_REQUESTS",
                    });
                } else {
                    console.error(e);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                    });
                }
            }
        }),
    verifyResetCode: publicProcedure
        .input(
            z.object({
                email: z.string(),
                code: z.string(),
            })
        )
        .query(async ({ input }) => {
            try {
                await UserController.verifyResetCode(input.email, input.code);
                return true;
            } catch (e) {
                return false;
            }
        }),
    updatePassword: publicProcedure
        .input(
            z.object({
                email: z.string(),
                code: z.string(),
                newPassword: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                return await UserController.updatePassword(
                    input.email,
                    input.code,
                    input.newPassword
                );
            } catch (e) {
                if (e instanceof GetUserError) {
                    throw new TRPCError({
                        message: e.message,
                        code: "BAD_REQUEST",
                    });
                } else if (e instanceof VerifyCodeError) {
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
    updateEmail: protectedProcedure
        .input(
            z.object({
                newEmail: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            try {
                return await UserController.updateEmail(
                    ctx.userId,
                    input.newEmail
                );
            } catch (e) {
                if (e instanceof GetUserError) {
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
    updateFirstName: protectedProcedure
        .input(
            z.object({
                newFirstName: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            try {
                return await UserController.updateFirstName(
                    ctx.userId,
                    input.newFirstName
                );
            } catch (e) {
                if (e instanceof GetUserError) {
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
    updateLastName: protectedProcedure
        .input(
            z.object({
                newLastName: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            try {
                return await UserController.updateLastName(
                    ctx.userId,
                    input.newLastName
                );
            } catch (e) {
                if (e instanceof GetUserError) {
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
    getUserInfo: protectedProcedure.query(async ({ ctx }) => {
        try {
            return await UserController.userInfo(ctx.userId);
        } catch (e) {
            if (e instanceof GetUserError) {
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
