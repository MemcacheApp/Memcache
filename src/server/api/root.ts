import { router } from "./trpc";
import { itemRouter } from "./routes/item";
import { userRouter } from "./routes/user";
import { collectionRouter } from "./routes/collection";
import { tagRouter } from "./routes/tag";

export const appRouter = router({
    item: itemRouter,
    user: userRouter,
    collection: collectionRouter,
    tag: tagRouter,
});

export type AppRouter = typeof appRouter;
