import { z } from "zod";

export const CreateItemData = z.object({
    url: z.string(),
    collection: z.string(),
    tags: z.string().array(),
    type: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    siteName: z.string().optional(),
    duration: z.number().optional(),
    releaseTime: z.date().optional(),
    author: z.string().optional(),
});

export type CreateItemDataType = z.infer<typeof CreateItemData>;
