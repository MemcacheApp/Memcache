import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import CollectionController from "./collection-controller";
import TagController from "./tag-controller";

export default class ItemController {
    static async createItem(
        userId: string,
        title: string,
        url: string,
        description: string,
        thumbnail: string | null,
        collectionName: string,
        tagNames: string[]
    ) {
        const collection = await CollectionController.getOrCreateCollection(
            userId,
            collectionName
        );
        const tags = await TagController.getOrCreateTags(userId, tagNames);
        const item = await prisma.item.create({
            data: {
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
        return await this.createItem(
            userId,
            "Title",
            url,
            "Description",
            null,
            collectionName,
            tagNames
        );
    }

    static async getItem(itemId: string) {
        const item = await prisma.item.findUnique({
            where: {
                id: itemId,
            },
        });
        return item;
    }

    static async getItems(userId: string) {
        const items = await prisma.item.findMany({
            where: {
                userId,
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
