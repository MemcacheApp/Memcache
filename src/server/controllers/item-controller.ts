import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import CollectionController from "./collection-controller";
import TagController from "./tag-controller";
import ogs from "open-graph-scraper";
import { FetchURLError, GetItemError } from "./errors/item";
import { AuthError } from "./errors/user";
import { ItemMetadata } from "@/src/datatypes/item";
import { hostname } from "@/src/utils";

export default class ItemController {
    /**
     * @throws {FetchURLError}
     */
    static async fetchMetadata(url: string): Promise<ItemMetadata> {
        let result;
        try {
            result = (await ogs({ url: url })).result;
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
        tagNames: string[]
    ) {
        const collection = await CollectionController.getOrCreateCollection(
            userId,
            collectionName
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
                status: 0,
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

    static async getUserItems(
        userId: string,
        includedTags?: string[],
        excludedTags?: string[]
    ) {
        const items = await prisma.item.findMany({
            where: {
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
            include: {
                tags: true,
                collection: true,
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

    static async getItemStatus(itemId: string) {
        const item = await prisma.item.findUnique({
            where: {
                id: itemId,
            },
        });
        return item?.status;
    }

    /**
     * @throws {GetItemError}
     * @throws {AuthError}
     */
    static async updateItemStatus(
        userId: string,
        itemId: string,
        status: number
    ) {
        const item = await this.getItem(itemId);

        if (item.userId !== userId) {
            throw new AuthError("NoPermission");
        }

        await prisma.item.update({
            where: {
                id: itemId,
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
        itemId: string,
        collectionName: string
    ) {
        const collection = await CollectionController.getOrCreateCollection(
            userId,
            collectionName
        );

        const item = await this.getItem(itemId);

        if (item.userId !== userId) {
            throw new AuthError("NoPermission");
        }

        await prisma.item.update({
            where: {
                id: itemId,
            },
            data: {
                // collection: {
                //     connect: { id: collection.id },
                // },
                collectionId: collection.id,
            },
            include: {
                tags: true,
                collection: true,
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
            include: {
                tags: true,
                collection: true,
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
            include: {
                tags: true,
                collection: true,
            },
        });
    }
}
