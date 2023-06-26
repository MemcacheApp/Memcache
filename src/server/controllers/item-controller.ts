import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import CollectionController from "./collection-controller";
import TagController from "./tag-controller";
import ogs from "open-graph-scraper";

export default class ItemController {
    static async createItem(
        userId: string,
        type: string,
        title: string,
        url: string,
        description: string,
        thumbnail: string | null,
        collectionName: string,
        tagNames: string[],
        siteName: string
    ) {
        const collection = await CollectionController.getOrCreateCollection(
            userId,
            collectionName
        );
        const tags = await TagController.getOrCreateTags(userId, tagNames);
        const item = await prisma.item.create({
            data: {
                type,
                id: uuidv4(),
                status: 0,
                collectionId: collection.id,
                tags: {
                    connect: tags.map((tag) => ({ id: tag.id })),
                },
                title,
                url,
                description,
                thumbnail,
                createdAt: new Date(),
                userId,
                siteName,
            },
        });

        return item;
    }

    static async createFromURL(
        userId: string,
        url: string,
        collectionName: string,
        tagNames: string[]
    ) {
        const { result } = await ogs({ url });

        return await this.createItem(
            userId,
            result.ogType || "website",
            result.ogTitle || result.twitterTitle || "Untitled",
            result.ogUrl || url,
            result.ogDescription || result.dcDescription || "",
            result.ogImage?.[0].url || result.twitterImage?.[0].url || null,
            collectionName,
            tagNames,
            result.ogSiteName || new URL(url).hostname
        );
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
}
