import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import CollectionController from "./collection-controller";
import TagController from "./tag-controller";
import ogs from "open-graph-scraper";
import { FetchURLError, GetItemError } from "./errors/item";
import { AuthError } from "./errors/user";
import { CreateItemDataType } from "./datatypes/item";

export default class ItemController {
    /**
     * @throws {FetchURLError}
     */
    static async fetchMetadata(url: string) {
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
            url: result.ogUrl || requestUrl,
            description: result.ogDescription || result.twitterDescription,
            thumbnail: result.ogImage?.[0].url || result.twitterImage?.[0].url,
            siteName: result.ogSiteName || new URL(requestUrl).hostname,
            duration: result.musicDuration
                ? parseInt(result.musicDuration)
                : undefined,
            releaseTime: result.releaseDate,
            author: result.author,
        };
    }

    static async createItem(userId: string, data: CreateItemDataType) {
        const collection = await CollectionController.getOrCreateCollection(
            userId,
            data.collection
        );
        const tags = await TagController.getOrCreateTags(userId, data.tags);

        const item = await prisma.item.create({
            data: {
                id: uuidv4(),
                type: data.type || "website",
                status: 0,
                collectionId: collection.id,
                tags: {
                    connect: tags.map((tag) => ({ id: tag.id })),
                },
                title: data.title || "Untitled",
                url: data.url,
                description: data.description || "",
                thumbnail: data.thumbnail,
                createdAt: new Date(),
                userId,
                siteName: data.siteName || new URL(data.url).hostname,
                duration: data.duration,
                releaseTime: data.releaseTime,
                author: data.author,
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

    static async getUserItems(userId: string) {
        const items = await prisma.item.findMany({
            where: {
                userId,
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
