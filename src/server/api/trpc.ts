import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { prisma } from "../db/db";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

export const createContext = (opts: FetchCreateContextFnOptions) => {
    const { req, resHeaders } = opts;

    return {
        req,
        resHeaders,
        prisma,
    };
};

const t = initTRPC.context<typeof createContext>().create({
    transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
    try {
        const cookieString = ctx.req.headers.get("cookie");
        if (!cookieString) throw new Error("No cookie in header");

        const c = cookie.parse(cookieString);
        if (!c.jwt) throw new Error("No JWT token in cookie");

        const jwtToken = c.jwt;

        // TODO: Fix this typescript
        const session: any = jwt.verify(jwtToken, "superSecretTestKey");

        await ctx.prisma.session
            .findFirstOrThrow({
                where: {
                    id: session.id,
                    userId: session.userId,
                },
            })
            .catch((err) => {
                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                    if (err.code === "P2025") {
                        throw new Error("Session not found");
                    }
                }
            });

        return next({
            ctx: {
                sessionId: session.id,
                userId: session.userId,
            },
        });

        // TODO: fix this typescript
    } catch (err: unknown) {
        console.log(err);
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
