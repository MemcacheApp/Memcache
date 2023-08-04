import { Collection, Item, Tag } from "@prisma/client";

export interface ItemMetadata {
    url: string;
    siteName: string;
    type?: string;
    title?: string;
    description?: string;
    thumbnail?: string;
    duration?: number;
    releaseTime?: string;
    author?: string;
    favicon?: string;
}

export interface SuggestedItem {
    type: string;
    url: string;
    thumbnail: string | null;
    title: string;
    description: string;
    siteName: string;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

export type ItemExt = Item & { collection: Collection; tags: Tag[] };
