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
    url: string;
    thumbnail: string | null;
    title: string;
    description: string;
}
