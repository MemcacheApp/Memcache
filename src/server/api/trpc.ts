import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { prisma } from "../db/prisma";
import UserController from "../controllers/user-controller";

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
        const userInfo = await UserController.validate(cookieString);

        return next({
            ctx: userInfo,
        });

        // TODO: fix this typescript
    } catch (err: unknown) {
        console.log(err);
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
