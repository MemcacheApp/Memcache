import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import UserController from "../../controllers/user-controller";

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
    userInfo: publicProcedure.query(async ({ ctx }) => {
        try {
            const cookieString = ctx.req.headers.get("cookie");
            const userInfo = await UserController.validate(cookieString);
            return userInfo;
        } catch (err) {
            return null;
        }
    }),
});
