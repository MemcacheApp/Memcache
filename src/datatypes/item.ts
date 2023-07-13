export interface CreateItemData {
    url: string;
    collectionId: string;
    tags: string[];
    type?: string;
    title?: string;
    description?: string;
    thumbnail?: string;
    siteName?: string;
    duration?: number;
    releaseTime?: Date;
    author?: string;
}
