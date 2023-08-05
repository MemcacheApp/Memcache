import { ItemStatus } from "@prisma/client";
import ogs from "open-graph-scraper";
import { v4 as uuidv4 } from "uuid";
import { ItemMetadata } from "../../datatypes/item";
import { hostname, normaliseURL } from "../../utils";
import { prisma } from "../db/prisma";
import CollectionController from "./collection-controller";
import { FetchURLError, GetItemError } from "./errors/item";
import { AuthError } from "./errors/user";
import TagController from "./tag-controller";
import UserController from "./user-controller";

export default class ItemController {
    /**
     * @throws {FetchURLError}
     */
    static async fetchMetadata(url: string): Promise<ItemMetadata> {
        const tweetMatch = url.match(
            /^(https?:\/\/)?(www.)?(twitter|x)\.com\/.+\/status\/(\d+)/,
        );
        if (tweetMatch) {
            return fetchTweetMetadata(url, tweetMatch[4]);
        }

        let result;
        try {
            result = (await ogs({ url: encodeURI(url) })).result;
        } catch (e) {
            throw new FetchURLError("FetchError", undefined, { cause: e });
        }

        const requestUrl = result.requestUrl;
        if (!requestUrl) {
            throw new FetchURLError("InvalidURL");
        }

        return {
            type: result.ogType,
            title: result.ogTitle || result.twitterTitle,
            url: requestUrl,
            description: result.ogDescription || result.twitterDescription,
            thumbnail: result.ogImage?.[0].url || result.twitterImage?.[0].url,
            siteName: result.ogSiteName || hostname(requestUrl),
            duration: result.musicDuration
                ? parseInt(result.musicDuration)
                : undefined,
            releaseTime: result.releaseDate,
            author: result.author,
            favicon: result.favicon
                ? new URL(result.favicon, requestUrl).href
                : undefined,
        };
    }

    static async createItem(
        userId: string,
        url: string,
        collectionName: string,
        tagNames: string[],
        isPublic: boolean,
    ) {
        const collection = await CollectionController.getOrCreateCollection(
            userId,
            collectionName,
        );
        const tags = await TagController.getOrCreateTags(userId, tagNames);

        let metadata;
        try {
            metadata = await this.fetchMetadata(url);
        } catch (e) {
            metadata = null;
        }

        const item = await prisma.item.create({
            data: {
                id: uuidv4(),
                type: metadata?.type || "website",
                public: isPublic,
                status: ItemStatus.Inbox,
                collectionId: collection.id,
                tags: {
                    connect: tags.map((tag) => ({ id: tag.id })),
                },
                title: metadata?.title || url,
                url: metadata?.url || url,
                description: metadata?.description || "",
                thumbnail: metadata?.thumbnail,
                createdAt: new Date(),
                userId,
                siteName: metadata?.siteName || hostname(url),
                duration: metadata?.duration,
                releaseTime: metadata?.releaseTime,
                author: metadata?.author,
                favicon: metadata?.favicon,
            },
        });

        return item;
    }

    /**
     * @throws {GetItemError}
     */
    static async getItem(itemId: string) {
        const item = await prisma.item.findUnique({
            where: {
                id: itemId,
            },
            include: {
                tags: true,
                collection: true,
            },
        });

        if (item === null) {
            throw new GetItemError("ItemNotExist");
        }

        return item;
    }

    static async getItems(itemIds: string[]) {
        return await prisma.item.findMany({
            where: {
                id: {
                    in: itemIds,
                },
            },
            include: {
                tags: true,
                collection: true,
            },
        });
    }

    static async getUserItems(
        userId: string,
        includedTags?: string[],
        excludedTags?: string[],
    ) {
        const items = await prisma.item.findMany({
            where: {
                AND: {
                    userId,
                    tags: {
                        some: includedTags
                            ? {
                                  name: {
                                      in: includedTags,
                                  },
                              }
                            : undefined,
                        none: excludedTags
                            ? {
                                  name: {
                                      in: excludedTags,
                                  },
                              }
                            : undefined,
                    },
                },
            },
            include: {
                tags: true,
                collection: true,
            },
        });

        return items;
    }

    static async getItemFlashcards(userId: string, itemId: string) {
        const item = await prisma.item.findUnique({
            where: {
                id: itemId,
            },
            include: {
                tags: true,
                collection: true,
                flashcards: { include: { reviews: true } },
            },
        });

        if (item === null) {
            throw new GetItemError("ItemNotExist");
        }

        if (item.userId !== userId) {
            throw new AuthError("NoPermission");
        }

        return item;
    }

    static async getUserItemsIncludeFlashcards(userId: string) {
        const items = await prisma.item.findMany({
            where: {
                userId,
            },
            include: {
                tags: true,
                collection: true,
                flashcards: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return items;
    }

    /**
     * @throws {GetItemError}
     * @throws {AuthError}
     */
    static async deleteItem(userId: string, itemId: string) {
        const item = await this.getItem(itemId);

        if (item.userId !== userId) {
            throw new AuthError("NoPermission");
        }

        await prisma.item.delete({
            where: {
                id: itemId,
            },
        });
    }

    /**
     * @throws {GetItemError}
     * @throws {AuthError}
     */
    static async updateItemStatus(
        userId: string,
        itemId: string | string[],
        status: ItemStatus,
    ) {
        if (!Array.isArray(itemId)) {
            itemId = [itemId];
        }

        const items = await this.getItems(itemId);

        if (items.find((item) => item.userId !== userId)) {
            throw new AuthError("NoPermission");
        }

        await prisma.item.updateMany({
            where: {
                id: {
                    in: itemId,
                },
            },
            data: {
                status: status,
            },
        });
    }

    /**
     * @throws {GetItemError}
     * @throws {AuthError}
     */
    static async setItemCollection(
        userId: string,
        itemId: string | string[],
        collectionName: string,
    ) {
        if (!Array.isArray(itemId)) {
            itemId = [itemId];
        }

        const collection = await CollectionController.getOrCreateCollection(
            userId,
            collectionName,
        );

        const items = await this.getItems(itemId);

        if (items.find((item) => item.userId !== userId)) {
            throw new AuthError("NoPermission");
        }

        await prisma.item.updateMany({
            where: {
                id: {
                    in: itemId,
                },
            },
            data: {
                collectionId: collection.id,
            },
        });
    }

    /**
     * @throws {GetItemError}
     * @throws {AuthError}
     */
    static async addTag(userId: string, itemId: string, tagName: string) {
        const tag = await TagController.getOrCreateTag(userId, tagName);

        const item = await this.getItem(itemId);

        if (item.userId !== userId) {
            throw new AuthError("NoPermission");
        }

        await prisma.item.update({
            where: {
                id: itemId,
            },
            data: {
                tags: {
                    connect: [{ id: tag.id }],
                },
            },
        });
    }

    /**
     * @throws {GetItemError}
     * @throws {AuthError}
     */
    static async removeTag(userId: string, itemId: string, tagId: string) {
        const item = await this.getItem(itemId);

        if (item.userId !== userId) {
            throw new AuthError("NoPermission");
        }

        await prisma.item.update({
            where: {
                id: itemId,
            },
            data: {
                tags: {
                    disconnect: [{ id: tagId }],
                },
            },
        });
    }

    /**
     * @throws {GetItemError}
     * @throws {AuthError}
     */
    static async setItemVibility(
        userId: string,
        itemId: string | string[],
        isPublic: boolean,
    ) {
        if (!Array.isArray(itemId)) {
            itemId = [itemId];
        }
        const items = await this.getItems(itemId);

        if (items.find((item) => item.userId !== userId)) {
            throw new AuthError("NoPermission");
        }

        await prisma.item.updateMany({
            where: {
                id: {
                    in: itemId,
                },
            },
            data: {
                public: isPublic,
            },
        });
    }

    /**
     * @throws {GetItemError}
     */
    static async getPublicItems(userId: string, targetId: string) {
        if (userId !== targetId) {
            const userInfo = await UserController.userInfo(targetId);
            if (!userInfo.publicProfile) {
                throw new GetItemError("PrivateProfile");
            }
        }

        return await prisma.item.findMany({
            where: {
                userId: targetId,
                public: true,
            },
            select: {
                type: true,
                url: true,
                thumbnail: true,
                title: true,
                description: true,
                siteName: true,
            },
        });
    }
}

async function fetchTweetMetadata(
    url: string,
    tweetId: string,
): Promise<ItemMetadata> {
    url = normaliseURL(url);
    console.log(url);

    const result = await fetch(
        `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}`,
    ).then((res) => res.json());

    console.log(result);

    return {
        type: "post",
        url,
        siteName: "Twitter",
        title: "Tweet",
        description: result.text,
        favicon: "https://abs.twimg.com/favicons/twitter.3.ico",
        thumbnail: result.mediaDetails
            ? result.mediaDetails[0]["media_url_https"]
            : undefined,
        author: result.user?.name,
        releaseTime: result["created_at"],
    };
}
