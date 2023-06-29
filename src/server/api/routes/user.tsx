import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import UserController from "../../controllers/user-controller";
import { Resend } from "resend";
import ResetPasswordEmail from "@/react-email-templates/emails/reset-password-email";
import { prisma } from "../../db/prisma";

const resend = new Resend("re_GtdRBzuT_h45BGz4jbSN5bK2mrSL7GM8c");

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
                const message =
                    e instanceof Error ? e.message : "Unknown Error";
                throw new TRPCError({
                    message,
                    code: "BAD_REQUEST",
                });
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
                const message =
                    e instanceof Error ? e.message : "Unknown Error";
                throw new TRPCError({
                    message,
                    code: "BAD_REQUEST",
                });
            }
        }),
    isLoggedIn: publicProcedure.query(async ({ ctx }) => {
        try {
            const cookieString = ctx.req.headers.get("cookie");
            await UserController.validate(cookieString);
            return true;
        } catch (err) {
            return false;
        }
    }),
    isValidEmail: publicProcedure
        .input(
            z.object({
                email: z.string(),
            })
        )
        .query(async ({ input }) => {
            return await UserController.isValidEmail(input.email);
        }),
    sendVerificationEmail: publicProcedure
        .input(
            z.object({
                email: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const code = Math.floor(Math.random() * 1000000)
                .toString()
                .padStart(6, "0");

            await resend.sendEmail({
                from: "onboarding@resend.dev",
                to: input.email,
                subject: "Memcache Password Reset Code",
                react: <ResetPasswordEmail code={code} />,
            });

            return code;
        }),
    updatePassword: publicProcedure
        .input(
            z.object({
                email: z.string(),
                newPassword: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                return await UserController.updatePassword(
                    input.email,
                    input.newPassword
                );
            } catch (e) {
                const message =
                    e instanceof Error ? e.message : "Unknown Error";
                throw new TRPCError({
                    message,
                    code: "BAD_REQUEST",
                });
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
                const message =
                    e instanceof Error ? e.message : "Unknown Error";
                throw new TRPCError({
                    message,
                    code: "BAD_REQUEST",
                });
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
                const message =
                    e instanceof Error ? e.message : "Unknown Error";
                throw new TRPCError({
                    message,
                    code: "BAD_REQUEST",
                });
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
                const message =
                    e instanceof Error ? e.message : "Unknown Error";
                throw new TRPCError({
                    message,
                    code: "BAD_REQUEST",
                });
            }
        }),
    getUserInfo: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.userId) {
            const user = await UserController.userInfo(ctx.userId);
            return user;
        } else {
            return null;
        }
    }),
});

// Resend API keys
// re_U6PbCMXV_NRrF4vTFmSsRjqG6phfcrtwA
// re_GtdRBzuT_h45BGz4jbSN5bK2mrSL7GM8c

// memcache3900@gmail.com
// bendermen3900
