import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import CollectionController from "./collection-controller";
import TagController from "./tag-controller";
import ogs from "open-graph-scraper";
import { Collection, Item, Tag } from "@prisma/client";

export default class ItemController {
    static async createFromURL(
        userId: string,
        url: string,
        collectionName: string,
        tagNames: string[]
    ) {
        const { result } = await ogs({ url });

        const collection = await CollectionController.getOrCreateCollection(
            userId,
            collectionName
        );
        const tags = await TagController.getOrCreateTags(userId, tagNames);

        return await prisma.item.create({
            data: {
                type: result.ogType || "website",
                id: uuidv4(),
                status: 0,
                collectionId: collection.id,
                tags: {
                    connect: tags.map((tag) => ({ id: tag.id })),
                },
                title: result.ogTitle || result.twitterTitle || "Untitled",
                url: result.ogUrl || url,
                description: result.ogDescription || result.dcDescription || "",
                thumbnail:
                    result.ogImage?.[0].url || result.twitterImage?.[0].url,
                createdAt: new Date(),
                userId,
                siteName: result.ogSiteName || new URL(url).hostname,
                duration: result.musicDuration
                    ? parseInt(result.musicDuration)
                    : undefined,
                releaseTime: result.releaseDate,
                author: result.author,
            },
        });
    }

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
        return item;
    }

    static async getItems(userId: string) {
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

    static async deleteItem(userId: string, itemId: string) {
        const item = await prisma.item.findUnique({
            where: {
                id: itemId,
            },
        });

        if (item && item.userId === userId) {
            await prisma.item.delete({
                where: {
                    id: itemId,
                },
            });
        }
    }

    static async updateItemStatus(
        userId: string,
        itemId: string,
        status: number
    ) {
        const item = await prisma.item.findUnique({
            where: {
                id: itemId,
            },
        });

        if (item && item.userId === userId) {
            return await prisma.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    status: status,
                },
            });
        }
    }

    static async setCollection(
        userId: string,
        itemId: string,
        collectionName: string
    ) {
        const collection = await CollectionController.getOrCreateCollection(
            userId,
            collectionName
        );

        let item: (Item & { collection: Collection; tags: Tag[] }) | null =
            await this.getItem(itemId);

        if (item && item.userId === userId) {
            item = await prisma.item.update({
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
        return item;
    }

    static async addTag(userId: string, itemId: string, tagName: string) {
        const tag = await TagController.getOrCreateTag(userId, tagName);

        let item: (Item & { collection: Collection; tags: Tag[] }) | null =
            await this.getItem(itemId);

        if (item && item.userId === userId) {
            item = await prisma.item.update({
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
        return item;
    }

    static async removeTag(userId: string, itemId: string, tagId: string) {
        let item: (Item & { collection: Collection; tags: Tag[] }) | null =
            await this.getItem(itemId);

        if (item && item.userId === userId) {
            item = await prisma.item.update({
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
        return item;
    }
}
