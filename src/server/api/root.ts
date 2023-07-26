import { collectionRouter } from "./routes/collection";
import { discoveryRouter } from "./routes/discovery";
import { flashcardsRouter } from "./routes/flashcards";
import { itemRouter } from "./routes/item";
import { summaryRouter } from "./routes/summary";
import { tagRouter } from "./routes/tag";
import { userRouter } from "./routes/user";
import { router } from "./trpc";

export const appRouter = router({
    item: itemRouter,
    user: userRouter,
    collection: collectionRouter,
    tag: tagRouter,
    flashcards: flashcardsRouter,
    summary: summaryRouter,
    discovery: discoveryRouter,
});

export type AppRouter = typeof appRouter;
